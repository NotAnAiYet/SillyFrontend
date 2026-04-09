import { useEffect, useRef } from 'react';
import { TURNSTILE_SITE_KEY } from '../consts';

interface TurnstileProps {
  active?: boolean;
  onReady?: () => void;
}

export function getTurnstileToken(): string {
  const ts = (window as any).turnstile;
  const widgetId = (window as any).__turnstileWidgetId;
  if (!ts || widgetId == null) return '';
  return ts.getResponse(widgetId) || '';
}

export function resetTurnstile(): void {
  const ts = (window as any).turnstile;
  const widgetId = (window as any).__turnstileWidgetId;
  if (!ts || widgetId == null) return;
  try {
    ts.reset(widgetId);
  } catch {}
}

export default function Turnstile({ active = false, onReady }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    if (!containerRef.current) return;
    if (!TURNSTILE_SITE_KEY) return;
    if (document.getElementById('turnstile-script')) return;
    const script = document.createElement('script');
    script.id = 'turnstile-script';
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const ts = (window as any).turnstile;
      if (!ts) return;
      (window as any).__turnstileWidgetId = ts.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: () => onReady && onReady(),
      });
    };
    script.onerror = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '<p class="small text-center text-danger mb-0">Could not load captcha script (network/adblock).</p>';
      }
    };
    document.head.appendChild(script);
    return () => {
      script.remove();
      if (containerRef.current) containerRef.current.innerHTML = '';
      (window as any).__turnstileWidgetId = null;
    };
  }, [active, onReady]);

  if (!active) return null;
  return (
    <div className="turnstile-wrap mb-3">
      <div style={{ minHeight: 65 }} ref={containerRef} />
    </div>
  );
}
