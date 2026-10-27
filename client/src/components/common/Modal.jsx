import { useEffect, useRef } from 'react';

function Modal({
  open,
  title,
  children,
  onClose,
  subheader,
  footer,
  size = 'medium',
  className = ''
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="rbp-modal-backdrop"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
    >
      <div
        ref={modalRef}
        className={`rbp-modal rbp-modal-${size} ${className}`.trim()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="rbp-modal-header">
          <h2 id="modal-heading" className="rbp-modal-title">{title}</h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {subheader && <div className="rbp-modal-subheader">{subheader}</div>}

        <div className="rbp-modal-body">{children}</div>

        {footer && <div className="rbp-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
