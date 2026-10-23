import { useState } from 'react';

function Tooltip({
  content,
  children,
  position = 'top',
  delay = 100,
  className = ''
}) {
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState(null);

  if (!content) {
    return children;
  }

  const showTooltip = () => {
    const t = setTimeout(() => {
      setVisible(true);
    }, delay);
    setTimer(t);
  };

  const hideTooltip = () => {
    if (timer) clearTimeout(timer);
    setVisible(false);
  };

  return (
    <div
      className={`rbp-tooltip-wrapper ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`rbp-tooltip rbp-tooltip-${position}`}
          aria-hidden="false"
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
