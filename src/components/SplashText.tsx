import { useEffect, useState } from 'react';
import splashes from '../data/splashes.json';

export default function SplashText() {
  const [splash, setSplash] = useState<string | null>(null);

  useEffect(() => {
    const idx = Math.floor(Math.random() * splashes.length);
    setSplash(splashes[idx]);
  }, []);

  if (!splash) return null;
  return (
    <span className="splash-text" aria-hidden="true">{splash}</span>
  );
}
