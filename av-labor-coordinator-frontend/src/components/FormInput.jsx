import React from 'react';
import '../styles/components/FormInput.css';

/**
 * FormInput Component - Reusable form input field
 * Props:
 * - label: Input label
 * - type: Input type (text, email, date, time, number, etc.)
 * - value: Input value
 * - onChange: Change handler
 * - placeholder: Placeholder text
 * - required: Is field required
 * - error: Error message
 * - disabled: Is field disabled
 */
export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  className = '',
  name,
  min,
  max,
  step,
  ...props
}) {
  return (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`form-input ${className}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
