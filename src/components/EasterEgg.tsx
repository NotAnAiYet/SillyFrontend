import { useState } from 'react';
import LinkButton from './LinkButton';

interface EasterEggProps {
  messages: string[];
}

export default function EasterEgg({ messages }: EasterEggProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [remainingMessages, setRemainingMessages] = useState<string[]>([...messages]);
  const [secretHunterUnlocked, setSecretHunterUnlocked] = useState(false);
  const [clicksAfterHunter, setClicksAfterHunter] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();


    if (secretHunterUnlocked) {
      const newClicks = clicksAfterHunter + 1;
      setClicksAfterHunter(newClicks);
      if (newClicks >= 5) {
        setMessage('🏆 Achievement unlocked: Persistent Clicker! You clicked ' + (messages.length + newClicks) + ' times total!');
      }
      return;
    }

    if (remainingMessages.length === 0) {
      setMessage('🏆 Achievement unlocked: Secret Hunter! You found all ' + messages.length + ' secrets!');
      setSecretHunterUnlocked(true);
    } else {
      const randomIndex = Math.floor(Math.random() * remainingMessages.length);
      const randomMessage = remainingMessages[randomIndex];
      setMessage(randomMessage);
       
      setRemainingMessages((prev) => prev.filter((_, i) => i !== randomIndex));
    }
  };

  return (
    <>
      <LinkButton onClick={handleClick}>Secret link</LinkButton>
      {message && (
        <span className="easter-egg-message d-block mt-1">
          {message}
        </span>
      )}
    </>
  );
}
