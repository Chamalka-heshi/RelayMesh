import React from 'react';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  trend,
  badge
}) {
  return (
    <div className={'kpi-metric-card ' + variant}>
      <div className="kpi-card-header">
        <span className="kpi-title">{title}</span>
        {Icon && (
          <div className={'kpi-icon-wrapper ' + variant}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="kpi-value-row">
        <span className="kpi-value">{value}</span>
        {badge && (
          <span className="kpi-badge">{badge}</span>
        )}
      </div>

      <div className="kpi-card-footer">
        <span className="kpi-subtitle">{subtitle}</span>
        {trend && (
          <span className={'kpi-trend ' + (trend.positive ? 'positive' : 'negative')}>
            {trend.label}
          </span>
        )}
      </div>
    </div>
  );
}
