import { useState, useEffect, useCallback } from 'react';
import Turnstile, { getTurnstileToken, resetTurnstile } from './turnstile';
import { SUPABASE_URL, SUPABASE_KEY } from '../consts';

interface GuestbookProps {
  title?: string;
  submitLabel?: string;
  limit?: number;
}

interface GuestbookEntry {
  name: string;
  message: string;
  created_at: string;
}

function formatGuestWhen(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '';
  }
}

export default function Guestbook({
  title = 'Guestbook',
  submitLabel = 'Submit for review ✉',
  limit = 35,
}: GuestbookProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [turnstileActive, setTurnstileActive] = useState(false);

  const fetchGuestbook = useCallback(async () => {
    const q = `select=name,message,created_at&order=created_at.desc&limit=${limit}`;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/guestbook?${q}`, {
      headers: {
        apikey: SUPABASE_KEY,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error((await res.text()) || String(res.status));
    return res.json();
  }, [limit]);

  const loadGuestbook = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await fetchGuestbook();
      setEntries(rows || []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [fetchGuestbook]);

  useEffect(() => {
    loadGuestbook();
  }, [loadGuestbook]);

  const submitGuestbookEdge = async (
    name: string,
    message: string,
    turnstileToken: string,
    website: string
  ) => {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-guestbook`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, message, turnstileToken, website }),
    });
    const t = await res.text();
    let body: { error?: string } = {};
    try {
      body = t ? JSON.parse(t) : {};
    } catch {
      body = {};
    }
    if (!res.ok) {
      throw new Error(body.error || (t && t.length < 200 ? t : null) || res.statusText || 'Request failed');
    }
    return body;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMsg = message.trim();
    const token = getTurnstileToken();

    if (!trimmedName || !trimmedMsg) {
      setToast('Please fill in both fields, cool visitor!');
      return;
    }
    if (!token) {
      setToast('Please complete the captcha!');
      return;
    }

    setToast('Sending your message…');
    try {
      await submitGuestbookEdge(trimmedName, trimmedMsg, token, honeypot);
      setToast(`Thanks, ${trimmedName}! Your note is pending review — it will show here after approval.`);
      setName('');
      setMessage('');
      setHoneypot('');
      resetTurnstile();
      loadGuestbook();
    } catch {
      setToast('Could not save — Error in Backend');
      resetTurnstile();
    }
  };

  return (
    <div className="retro-panel mb-4 guestbook-box">
      <h2 className="panel-title">{title}</h2>
      <p className="small text-center mb-3">Approved messages only. New entries need a quick captcha.</p>

      <ul className="guestbook-entries list-unstyled mb-3" aria-label="Recent guestbook entries">
        {loading ? (
          <li className="guestbook-loading small text-center">Loading signatures…</li>
        ) : entries.length === 0 ? (
          <li className="guestbook-entry guestbook-empty small text-center">
            No approved entries yet — say hi below (shows after moderation).
          </li>
        ) : (
          entries.map((entry, i) => (
            <li key={i} className="guestbook-entry">
              <div className="guestbook-entry-meta">
                <strong className="guestbook-name">{entry.name || 'Anonymous'}</strong>
                {formatGuestWhen(entry.created_at) && (
                  <>
                    {' · '}
                    <span className="guestbook-when">{formatGuestWhen(entry.created_at)}</span>
                  </>
                )}
              </div>
              <p className="guestbook-message mb-0">{entry.message || ''}</p>
            </li>
          ))
        )}
      </ul>

      <form className="guestbook-form" onSubmit={handleSubmit} noValidate>
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="guest-website">Leave this empty</label>
          <input
            type="text"
            id="guest-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="guest-name" className="form-label visually-hidden">
            Your name
          </label>
          <input
            type="text"
            id="guest-name"
            className="form-control retro-input"
            placeholder="Your stellar nickname"
            maxLength={40}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="guest-msg" className="form-label visually-hidden">
            Message
          </label>
          <textarea
            id="guest-msg"
            className="form-control retro-input"
            rows={3}
            placeholder="Drop a friendly note..."
            maxLength={200}
            required
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setTurnstileActive(e.target.value.trim().length > 0);
            }}
          />
        </div>
        <Turnstile active={turnstileActive} />
        <button type="submit" className="btn btn-retro w-100">
          {submitLabel}
        </button>
      </form>

      <p className={`guestbook-toast mt-3 mb-0 ${toast ? 'visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </p>
    </div>
  );
}
