
import { useCallback } from 'react';
import { LAST_UPDATED } from '../consts';
import { confetti } from '@tsparticles/confetti';

interface ConfettiProps {
  buttonText?: string;
  colors?: string[];
  count?: number;
}

export default function Confetti({
  buttonText = 'click for celebratory Confetti',
  colors = ['#ff006e', '#8338ec', '#3a86ff', '#ffbe0b', '#fb5607', '#06ffa5', '#ff69eb'],
  count = 200,
}: ConfettiProps) {
  const lastUpdated = new Date(LAST_UPDATED).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const spawnConfetti = useCallback(async () => {
    await confetti('tsparticles', {
      count,
      colors,
      position: { x: 50, y: -5 }, // above the top edge
      spread: 180, // very wide spread
      startVelocity: 90,
      ticks: 50,
      gravity: 1.5,
      shapes: ['square', 'circle'],
      scalar: 2,
    });
  }, [colors, count]);

  return (
      <div className="retro-panel mt-4 last-updated">
        <p className="mb-0 small text-center">
          Last updated: <time>{lastUpdated}</time>
          <br />
          <button type="button" onClick={spawnConfetti} className="btn-link-retro mt-2">
            {buttonText}
          </button>
        </p>
      </div>
  );
}
