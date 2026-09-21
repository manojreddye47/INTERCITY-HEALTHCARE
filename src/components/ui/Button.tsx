import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:bg-blue-800',
      gradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 shadow-md shadow-blue-500/20',
      destructive: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm',
      outline: 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-2xs',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
      ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
      link: 'text-blue-600 underline-offset-4 hover:underline dark:text-blue-400 p-0 h-auto font-normal',
      success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-500/20',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-xl',
      md: 'h-10 px-4 py-2 text-xs sm:text-sm rounded-xl',
      lg: 'h-12 px-6 text-sm sm:text-base rounded-2xl',
      icon: 'h-10 w-10 p-2 rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
