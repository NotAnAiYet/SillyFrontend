import { useState, useRef, useCallback } from 'react';

interface ConfettiProps {
  buttonText?: string;
  colors?: string[];
  count?: number;
}

export default function Confetti({
  buttonText = 'click for celebratory pixels',
  colors = ['#ff006e', '#8338ec', '#3a86ff', '#ffbe0b', '#fb5607', '#06ffa5', '#ff69eb'],
  count = 48,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);
  const nextId = useRef(0);

  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const spawnConfetti = useCallback(() => {
    const newPieces = Array.from({ length: count }, () => {
      const id = nextId.current++;
      return {
        id,
        style: {
          left: `${Math.random() * 100}%`,
          background: colors[Math.floor(Math.random() * colors.length)],
          animationDuration: `${2.5 + Math.random() * 2}s`,
          animationDelay: `${Math.random() * 0.3}s`,
          '--dx': `${(Math.random() - 0.5) * 200}px`,
        } as React.CSSProperties,
      };
    });
    setPieces((prev) => [...prev, ...newPieces]);
  }, [colors, count]);

  const handleAnimationEnd = useCallback((id: number) => {
    setPieces((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <>
      <div className="retro-panel mt-4 last-updated">
        <p className="mb-0 small text-center">
          Last updated: <time>{lastUpdated}</time>
          <br />
          <button type="button" onClick={spawnConfetti} className="btn-link-retro mt-2">
            {buttonText}
          </button>
        </p>
      </div>
      <div className="confetti-layer" aria-hidden="true">
        {pieces.map((piece) => (
          <span
            key={piece.id}
            className="confetti-piece"
            style={piece.style}
            onAnimationEnd={() => handleAnimationEnd(piece.id)}
          />
        ))}
      </div>
    </>
  );
}
