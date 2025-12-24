import React from 'react';
import '../styles/components/Card.css';

/**
 * Card Component - Reusable card container
 * Props:
 * - title: Card header title
 * - children: Card content
 * - footer: Optional footer content
 * - shadow: shadow level (sm, md, lg)
 */
export default function Card({
  title,
  children,
  footer,
  shadow = 'md',
  className = '',
}) {
  return (
    <div className={`card card-shadow-${shadow} ${className}`}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
