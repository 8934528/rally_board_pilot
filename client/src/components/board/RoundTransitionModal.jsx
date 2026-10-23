import { useEffect, useState } from 'react';

function RoundTransitionModal({
  roundNumber,
  roundName,
  active
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2300);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [active, roundNumber]);

  if (!visible) return null;

  return (
    <div className="round-transition-overlay" role="dialog" aria-modal="true">
      <div className="round-transition-card">
        <div className="transition-eyebrow">GET READY</div>
        <div className="transition-round-title">
          ROUND {roundNumber}
        </div>
        <div className="transition-round-name">
          {roundName}
        </div>
        <div className="transition-loading-bar">
          <div className="transition-bar-fill" />
        </div>
      </div>
    </div>
  );
}

export default RoundTransitionModal;
