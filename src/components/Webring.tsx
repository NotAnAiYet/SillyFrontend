import { useState, useRef, useCallback } from 'react';

interface WebringProps {
  title?: string;
  description?: string;
  sites: string[];
}

export default function Webring({
  title = 'Web neighborhood',
  description = 'Pretend webring (click for nostalgia):',
  sites,
}: WebringProps) {
  const [status, setStatus] = useState('');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const getSite = useCallback(
    (direction: string) => {
      if (!sites || sites.length === 0) return { label: 'No sites available', index: null };

      let i = currentIndex ?? Math.floor(Math.random() * sites.length);
      if (direction === 'random' || i == null) {
        if (sites.length === 1) {
          i = 0;
        } else {
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * sites.length);
          } while (newIndex === currentIndex);
          i = newIndex;
        }
      } else if (direction === 'prev') {
        i = (i + sites.length - 1) % sites.length;
      } else if (direction === 'next') {
        i = (i + 1) % sites.length;
      }
      return { label: sites[i], index: i };
    },
    [sites, currentIndex]
  );

  const handleClick = useCallback(
    (direction: string) => {
      const { label, index } = getSite(direction);
      setCurrentIndex(index);
      setStatus(`Transporting you to… "${label}" (okay, it's pretend — but enjoy the thought!)`);
    },
    [getSite]
  );

  return (
    <div className="retro-panel webring">
      <h2 className="panel-title">{title}</h2>
      <p className="small mb-2">{description}</p>
      <div className="d-flex flex-wrap gap-2">
        <button type="button" className="btn btn-ring" onClick={() => handleClick('prev')}>
          « prev site
        </button>
        <button type="button" className="btn btn-ring" onClick={() => handleClick('random')}>
          random ★
        </button>
        <button type="button" className="btn btn-ring" onClick={() => handleClick('next')}>
          next site »
        </button>
      </div>
      <p className="ring-status small mt-3 mb-0">{status}</p>
    </div>
  );
}
