import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, label, error, helperText, children, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <select
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white transition-all',
          error && 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs font-medium text-rose-500 dark:text-rose-400">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-400">{helperText}</p>}
    </div>
  );
});
Select.displayName = 'Select';

export { Select };
