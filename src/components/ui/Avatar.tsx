import * as React from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ className, src, alt, fallback, size = 'md', ...props }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const getInitials = (name?: string) => {
    if (!name) return null;
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center',
        sizes[size],
        className
      )}
      {...props}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="aspect-square h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : fallback ? (
        <span className="font-medium text-gray-600 dark:text-gray-300">{getInitials(fallback)}</span>
      ) : (
        <User className="h-1/2 w-1/2 text-gray-400 dark:text-gray-500" />
      )}
    </div>
  );
}
