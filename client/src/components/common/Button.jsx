function Button({
  children,
  variant = 'secondary',
  size = 'medium',
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      className={[
        'rbp-button',
        `rbp-button-${variant}`,
        `rbp-button-${size}`,
        className
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}>
      {children}
    </button>
  );
}

export default Button;
