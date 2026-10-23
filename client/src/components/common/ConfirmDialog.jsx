import Modal from './Modal';
import Button from './Button';

function ConfirmDialog({
  open,
  title = 'Confirm Action',
  message,
  onConfirm,
  onCancel
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onCancel}>
            CANCEL
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}>
            CONFIRM
          </Button>
        </>
      }>

      <p className="confirm-message">
        {message}
      </p>
    </Modal>
  );
}

export default ConfirmDialog;
