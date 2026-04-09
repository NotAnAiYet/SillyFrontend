import { useState, useEffect } from 'react';

interface HitCounterProps {
  welcomeText?: string;
  defaultHits?: number;
}

const SUPABASE_URL = 'https://gjhnqhijtyrhzynhpbmc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_i4FRid5xYkvVXDDtdcF3WQ_V1HJs5Gj';
const HIT_ALREADY_COUNTED = 'sb_homepage_hit_counted_v1';

function padHits(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(7, '0').slice(-7);
}

export default function HitCounter({
  welcomeText = '★ WELCOME VISITOR ★ Best viewed in Netscape at 800×600 (just kidding)',
  defaultHits = 1337,
}: HitCounterProps) {
  const [count, setCount] = useState(defaultHits);

  useEffect(() => {
    async function incrementHitCounterRemote() {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_hit_counter`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
        body: '{}',
      });
      if (!res.ok) throw new Error((await res.text()) || String(res.status));
      return res.json();
    }

    async function fetchCurrentCount() {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/hit_counter`, {
        headers: {
          apikey: SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error((await res.text()) || String(res.status));
      const arr = await res.json();
      const n = Array.isArray(arr) && arr.length && typeof arr[0].count === 'number' ? arr[0].count : null;
      if (n === null || !Number.isFinite(n)) throw new Error('bad counter payload');
      return n;
    }

    async function initHitCounter() {
      const alreadyCounted = localStorage.getItem(HIT_ALREADY_COUNTED);
      try {
        if (alreadyCounted) {
          setCount(await fetchCurrentCount());
        } else {
          localStorage.setItem(HIT_ALREADY_COUNTED, '1');
          const value = await incrementHitCounterRemote();
          const n = typeof value === 'number' ? value : parseInt(String(value), 10);
          if (!Number.isFinite(n)) throw new Error('bad counter payload');
          setCount(n);
        }
      } catch {
        setCount(defaultHits);
      }
    }

    initHitCounter();
  }, [defaultHits]);

  const display = padHits(count);

  return (
    <div className="marquee-wrap mb-4" aria-hidden="true">
      <div className="marquee-inner">
        <span className="marquee-text">
          {welcomeText} ★ You are one of <span>{display}</span> guests! ★ Thanks for stopping by! ★
        </span>
        <span className="marquee-text" aria-hidden="true">
          {welcomeText} ★ You are one of <span>{display}</span> guests! ★ Thanks for stopping by! ★
        </span>
      </div>
    </div>
  );
}
