function Modal({
  open,
  title,
  children,
  onClose,
  footer
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="rbp-modal-backdrop"
      onMouseDown={onClose}>

      <div
        className="rbp-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }>

        <div className="rbp-modal-header">
          <h2>{title}</h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}>
            ×
          </button>
        </div>

        <div className="rbp-modal-body">
          {children}
        </div>

        {footer && (
          <div className="rbp-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
