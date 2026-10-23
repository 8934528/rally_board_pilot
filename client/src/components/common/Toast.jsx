function Toast({
  message,
  type = 'info',
  onClose
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`rbp-toast rbp-toast-${type}`}>
      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}>
        ×
      </button>
    </div>
  );
}

export default Toast;
