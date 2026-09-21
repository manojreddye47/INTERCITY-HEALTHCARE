import React from 'react';
import { Badge } from './Badge';
import { getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const color = getStatusColor(status);
  
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' = 'default';
  
  if (color === 'emerald') variant = 'success';
  else if (color === 'amber') variant = 'warning';
  else if (color === 'red') variant = 'destructive';
  else if (color === 'blue') variant = 'default';
  else if (color === 'gray') variant = 'secondary';

  return (
    <Badge variant={variant} className={cn('capitalize', className)} {...props}>
      {status.toLowerCase().replace('_', ' ')}
    </Badge>
  );
}
