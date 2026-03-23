import React from 'react';
import { Badge } from '../ui/badge';
import { STATUS_COLORS } from '../../lib/uiConstants';

/**
 * Reusable Status Badge Component
 * Provides consistent status indicators with proper dark mode support
 */
export function StatusBadge({ 
  status, 
  label,
  variant = 'default',
  className = '',
}) {
  const statusClass = STATUS_COLORS[status?.toLowerCase()] || STATUS_COLORS.inactive;
  const displayLabel = label || status;

  return (
    <Badge 
      variant={variant}
      className={`${statusClass} border ${className}`}
    >
      {displayLabel}
    </Badge>
  );
}

/**
 * Predefined Status Badges for common use cases
 */
export const AttendanceBadge = ({ status }) => (
  <StatusBadge status={status} label={status} />
);

export const CompletionBadge = ({ status }) => (
  <StatusBadge status={status} label={status} />
);

export const ClassStatusBadge = ({ status }) => (
  <StatusBadge status={status} label={status} />
);
