import React from 'react';
import '../styles/components/LoadingSpinner.css';

/**
 * LoadingSpinner Component - Loading indicator
 * Props:
 * - size: Spinner size (sm, md, lg)
 * - message: Optional loading message
 * - fullscreen: Full-screen overlay
 */
export default function LoadingSpinner({
  size = 'md',
  message = 'Loading...',
  fullscreen = false,
}) {
  const spinnerClass = fullscreen
    ? 'spinner-fullscreen'
    : `spinner spinner-${size}`;

  return (
    <div className={spinnerClass}>
      <div className="spinner-content">
        <div className="spinner-wheel"></div>
        {message && <p className="spinner-message">{message}</p>}
      </div>
    </div>
  );
}
