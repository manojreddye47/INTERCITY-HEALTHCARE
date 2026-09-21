import { cn } from '@/lib/utils';
import React from 'react';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-800', className)} {...props} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[250px] max-w-[80%]" />
          <Skeleton className="h-4 w-[200px] max-w-[60%]" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full border rounded-lg border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="bg-gray-50/50 dark:bg-gray-800/50 p-4 flex gap-4 border-b border-gray-200 dark:border-gray-800">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4 items-center bg-white dark:bg-gray-900">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-8 rounded-full ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export { Skeleton };
