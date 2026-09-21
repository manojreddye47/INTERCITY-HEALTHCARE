import { useState } from 'react';
import { Moon, Sun, ChevronDown, User, Settings, LogOut, Menu, Activity, Plus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { getInitials, cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TopBarProps {
  onMenuClick: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Overview',
  'book-appointment': 'Book Consultation',
  'ai-booker': 'AI Appointment Booker',
  appointments: 'My Appointments',
  'medical-history': 'Medical History & Timeline',
  reports: 'Diagnostic Lab Reports',
  prescriptions: 'Active Medications',
  payments: 'Billing & Invoices',
  feedback: 'Patient Feedback',
  notifications: 'Notifications Center',
  profile: 'Account Profile',
  settings: 'Preferences & Security',
  agenda: "Today's Clinical Agenda",
  patients: 'Patient Directory',
  calendar: 'Master Calendar',
  shifts: 'Shift Roster',
  'working-hours': 'Working Hours',
  leave: 'Leave Management',
  productivity: 'Clinical Productivity',
  departments: 'Hospital Departments',
  doctors: 'Physicians & Specialists',
  finances: 'Revenue Analytics',
  salaries: 'Staff Salaries',
  'audit-logs': 'System Audit Logs',
};

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, signOut } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const segment = location.pathname.split('/').pop() || 'dashboard';
  const pageTitle = PAGE_TITLES[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/auth/login');
  };

  const renderQuickAction = () => {
    if (!user) return null;
    if (user.role === 'patient') {
      return (
        <Link
          to="/patient/book-appointment"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-xl shadow-sm shadow-blue-500/20 active:scale-[0.98] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book Visit</span>
        </Link>
      );
    }
    if (user.role === 'doctor') {
      return (
        <Link
          to="/doctor/agenda"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/40 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-xl transition-all"
        >
          <Activity className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
          <span>Live Queue</span>
        </Link>
      );
    }
    return (
      <Link
        to="/admin/appointments"
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>New Booking</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8">
      {/* Left: Hamburger + Page Context */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
              {pageTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* Middle: Emergency / Clinical Status indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-live-pulse" />
        <span className="font-medium text-slate-600 dark:text-slate-400">
          ER 24/7 Active
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="text-slate-500 dark:text-slate-400">Avg Wait: 8m</span>
      </div>

      {/* Right: Quick Action + Theme + Notifications + User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {renderQuickAction()}

        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all active:scale-95"
          aria-label="Toggle visual theme"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun className="w-4.5 h-4.5 text-amber-400" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-slate-600" />
          )}
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Profile Pill */}
        <div className="relative ml-1">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1 sm:pr-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all focus:outline-none"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {getInitials(user?.displayName || 'U')}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {user?.displayName?.split(' ')[0]}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">
                {user?.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in-0 zoom-in-95">
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.displayName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {user?.email}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { navigate(`/${user?.role}/profile`); setShowDropdown(false); }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => { navigate(`/${user?.role}/settings`); setShowDropdown(false); }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
