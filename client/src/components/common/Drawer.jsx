import { useEffect, useRef } from 'react';

function Drawer({
  open,
  onClose,
  title,
  id = 'appDrawer',
  side = 'start', // 'start' or 'end'
  children
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        try {
          dialog.showModal();
        } catch {
          dialog.setAttribute('open', '');
        }
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
    };

    const handleClick = (e) => {
      
      const rect = dialog.getBoundingClientRect();
      const isInDialog = rect.top <= e.clientY && e.clientY <= rect.top + rect.height && rect.left <= e.clientX && e.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        onClose();
      }
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleClick);

    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={`rbp-drawer drawer drawer-${side}`}
      tabIndex={-1}
      id={id}
      aria-labelledby={`${id}Label`}
      aria-modal="true"
    >
      <div className="drawer-header rbp-drawer-header">
        <h5 className="drawer-title rbp-drawer-title" id={`${id}Label`}>
          {title}
        </h5>

        <button
          type="button"
          className="btn-close rbp-drawer-close"
          onClick={onClose}
          aria-label="Close"/>
      </div>

      <div className="drawer-body rbp-drawer-body">
        {children}
      </div>
    </dialog>
  );
}

export default Drawer;
