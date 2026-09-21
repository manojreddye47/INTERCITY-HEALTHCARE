import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorVariant?: 'blue' | 'emerald' | 'amber' | 'purple' | 'red';
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, colorVariant = 'blue', className }: StatCardProps) {
  const colorMap = {
    blue: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40',
    purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/40',
    red: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40',
  };

  return (
    <div className={cn('p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:shadow-md', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</h2>
            {trend && (
              <span className={cn('flex items-center text-xs font-bold', trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                {trend.isPositive ? <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
        <div className={cn('p-3 rounded-2xl shrink-0 shadow-sm', colorMap[colorVariant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
