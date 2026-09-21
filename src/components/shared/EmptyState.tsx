import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-10 text-center bg-slate-50/50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300/80 dark:border-slate-800', className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4 border border-blue-200/40 dark:border-blue-800/40 shadow-sm">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="rounded-xl px-5 text-xs font-bold">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
