import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, label, error, helperText, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white transition-all',
          error && 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="text-xs font-medium text-rose-500 dark:text-rose-400">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-400">{helperText}</p>}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
