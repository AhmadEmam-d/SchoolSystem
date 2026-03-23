import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

/**
 * Reusable Stat Card Component
 * Used for displaying statistics across dashboards
 */
export function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  trendLabel,
  onClick,
  className = '',
  valueColor = 'text-foreground',
}) {
  const CardWrapper = onClick ? 'button' : 'div';
  const cardProps = onClick ? { onClick, className: 'text-left w-full' } : {};

  return (
    <CardWrapper {...cardProps}>
      <Card className={`hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && (
            <Icon className="h-4 w-4 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${valueColor}`}>
            {value}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-medium ${
                trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                trend === 'down' ? 'text-red-600 dark:text-red-400' : 
                'text-muted-foreground'
              }`}>
                {trendLabel}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}