import React from 'react';
import Breadcrumb from './Breadcrumb';

export default function PageHeader({
  title,
  subtitle,
  badge,
  action,
  breadcrumbs = [],
  onNavigate
}) {
  return (
    <div className="page-header-container">
      {breadcrumbs.length > 0 && (
        <div className="page-header-breadcrumb-row">
          <Breadcrumb items={breadcrumbs} onNavigate={onNavigate} />
        </div>
      )}

      <div className="page-header-main-row">
        <div className="page-header-titles">
          <div className="flex items-center gap-2">
            <h1 className="page-main-title">{title}</h1>
            {badge && <span className="page-header-badge">{badge}</span>}
          </div>
          {subtitle && <p className="page-main-subtitle">{subtitle}</p>}
        </div>

        {action && <div className="page-header-actions">{action}</div>}
      </div>
    </div>
  );
}
