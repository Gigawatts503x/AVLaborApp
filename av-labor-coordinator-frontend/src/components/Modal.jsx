import React from 'react';
import '../styles/components/Modal.css';

/**
 * Modal Component - Reusable modal dialog
 * Props:
 * - isOpen: Is modal open
 * - title: Modal title
 * - children: Modal content
 * - onClose: Close handler
 * - actions: Optional action buttons
 * - size: Modal size (sm, md, lg)
 */
export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  actions,
  size = 'md',
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-footer">{actions}</div>}
      </div>
    </div>
  );
}
