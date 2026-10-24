import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function Tooltip({
  content,
  children,
  position = 'top',
  delay = 100,
  className = ''
}) {
  const [visible, setVisible] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const wrapperRef = useRef(null);
  const showTimerRef = useRef(null);

  const clearShowTimer = () => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  };

  const showTooltip = () => {
    clearShowTimer();
    showTimerRef.current = setTimeout(() => {
      const el = wrapperRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        setAnchor({
          x: rect.left + rect.width / 2,
          y: position === 'bottom' ? rect.bottom : rect.top
        });
      }
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearShowTimer();
    setVisible(false);
  };

  
  
  useEffect(() => {
    if (!visible) return undefined;

    window.addEventListener('scroll', hideTooltip, true);
    window.addEventListener('resize', hideTooltip);

    return () => {
      window.removeEventListener('scroll', hideTooltip, true);
      window.removeEventListener('resize', hideTooltip);
    };
  }, [visible]);

  useEffect(() => () => clearShowTimer(), []);

  if (!content) {
    return children;
  }

  return (
    <div
      ref={wrapperRef}
      className={`rbp-tooltip-wrapper ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {visible && anchor && createPortal(
        <div
          role="tooltip"
          className={`rbp-tooltip rbp-tooltip-${position}`}
          style={{ left: `${anchor.x}px`, top: `${anchor.y}px` }}
          aria-hidden="false"
        >
          {content}
        </div>,
        document.body
      )}
    </div>
  );
}

export default Tooltip;
