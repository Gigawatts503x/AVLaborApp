import React, { useState } from 'react';
import '../styles/components/Alert.css';

/**
 * Alert Component - Reusable alert/notification
 * Types: success, error, warning, info
 * Props:
 * - type: Alert type
 * - title: Alert title
 * - message: Alert message
 * - dismissible: Show close button
 * - onDismiss: Dismiss handler
 */
export default function Alert({
  type = 'info',
  title,
  message,
  dismissible = true,
  onDismiss,
}) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss && onDismiss();
  };

  if (!isVisible) return null;

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <span className="alert-icon">{iconMap[type]}</span>
        <div className="alert-text">
          {title && <strong className="alert-title">{title}</strong>}
          {message && <p className="alert-message">{message}</p>}
        </div>
      </div>
      {dismissible && (
        <button className="alert-close" onClick={handleDismiss}>
          ✕
        </button>
      )}
    </div>
  );
}
