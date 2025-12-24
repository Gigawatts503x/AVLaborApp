import React from 'react';
import '../styles/components/Button.css';

/**
 * Button Component - Reusable button with multiple variants
 * Variants: primary, secondary, outline, danger
 * Sizes: sm, md, lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const buttonClass = `btn btn-${variant} btn-${size} ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
