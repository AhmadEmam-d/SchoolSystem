import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

/**
 * Reusable Page Header Component
 * Provides consistent page headers with optional back button and actions
 */
export function PageHeader({ 
  title, 
  description, 
  showBack = false,
  backTo,
  actions,
  className = '',
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 ${className}`}>
      <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
        {showBack && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}