import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM dd, yyyy');
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'hh:mm a');
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM dd, yyyy • hh:mm a');
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isToday(d)) return `Today, ${formatTime(d)}`;
  if (isTomorrow(d)) return `Tomorrow, ${formatTime(d)}`;
  return formatDateTime(d);
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    scheduled: 'status-scheduled',
    confirmed: 'status-confirmed',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
    pending: 'status-pending',
    arrived: 'status-arrived',
    'patient-arrived': 'status-arrived',
    approved: 'status-confirmed',
    rejected: 'status-cancelled',
    paid: 'status-confirmed',
    unpaid: 'status-pending',
    refunded: 'status-scheduled',
  };
  return map[status.toLowerCase()] || 'status-pending';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export const APPOINTMENT_STATUSES = [
  'Scheduled',
  'Confirmed',
  'Patient Arrived',
  'Consultation Started',
  'Completed',
  'Patient Did Not Arrive',
  'Cancelled',
  'Rescheduled',
] as const;

export type AppointmentStatus = typeof APPOINTMENT_STATUSES[number];
