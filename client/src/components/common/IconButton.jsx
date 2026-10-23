import Tooltip from './Tooltip';

function IconButton({
  icon,
  label,
  tooltip,
  shortcut,
  variant = 'secondary',
  size = 'small',
  className = '',
  onClick,
  disabled = false,
  ...props
}) {
  const tooltipText = tooltip || label;

  const buttonElement = (
    <button
      type="button"
      className={[
        'rbp-icon-btn',
        `rbp-icon-btn-${variant}`,
        `rbp-icon-btn-${size}`,
        disabled ? 'disabled' : '',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      {...props}>
      <i className={`bi bi-${icon}`} aria-hidden="true" />
      {shortcut && <span className="rbp-shortcut-badge">{shortcut}</span>}
    </button>
  );

  if (tooltipText) {
    return (
      <Tooltip content={tooltipText}>
        {buttonElement}
      </Tooltip>
    );
  }

  return buttonElement;
}

export default IconButton;
