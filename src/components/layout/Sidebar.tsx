import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarPlus, Sparkles, Calendar, FileText,
  BarChart2, Pill, CreditCard, Bell, Star, User, Settings,
  ClipboardList, Users, CalendarDays, Clock,
  Timer, Plane, TrendingUp, Stethoscope, Building2, DollarSign,
  Banknote, Settings2, Shield, LogOut, Heart, ChevronRight, Activity
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getInitials, cn } from '@/lib/utils';
import { toast } from 'sonner';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  highlight?: boolean;
  badge?: number | string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export function Sidebar() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const patientSections: NavSection[] = [
    {
      title: 'Care & Booking',
      items: [
        { name: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
        { name: 'Book Appointment', href: '/patient/book-appointment', icon: CalendarPlus },
        { name: 'AI Appointment Booker', href: '/patient/ai-booker', icon: Sparkles, highlight: true, badge: 'AI' },
      ],
    },
    {
      title: 'Medical Records',
      items: [
        { name: 'My Appointments', href: '/patient/appointments', icon: Calendar },
        { name: 'Medical History', href: '/patient/medical-history', icon: FileText },
        { name: 'Lab Reports', href: '/patient/reports', icon: BarChart2 },
        { name: 'Prescriptions', href: '/patient/prescriptions', icon: Pill },
      ],
    },
    {
      title: 'Services & Account',
      items: [
        { name: 'Billing & Payments', href: '/patient/payments', icon: CreditCard },
        { name: 'Feedback & Reviews', href: '/patient/feedback', icon: Star },
        { name: 'Notifications', href: '/patient/notifications', icon: Bell, badge: 2 },
        { name: 'Profile & Settings', href: '/patient/profile', icon: User },
      ],
    },
  ];

  const doctorSections: NavSection[] = [
    {
      title: 'Clinical Practice',
      items: [
        { name: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
        { name: "Today's Agenda", href: '/doctor/agenda', icon: ClipboardList, badge: 'Live' },
        { name: 'Appointments', href: '/doctor/appointments', icon: Calendar },
        { name: 'Patient Directory', href: '/doctor/patients', icon: Users },
      ],
    },
    {
      title: 'Schedule & Duty',
      items: [
        { name: 'Master Calendar', href: '/doctor/calendar', icon: CalendarDays },
        { name: 'Shift Roster', href: '/doctor/shifts', icon: Clock },
        { name: 'Working Hours', href: '/doctor/working-hours', icon: Timer },
        { name: 'Leave Management', href: '/doctor/leave', icon: Plane },
      ],
    },
    {
      title: 'Performance & Profile',
      items: [
        { name: 'Productivity & KPIs', href: '/doctor/productivity', icon: TrendingUp },
        { name: 'Doctor Profile', href: '/doctor/profile', icon: User },
        { name: 'Settings', href: '/doctor/settings', icon: Settings },
      ],
    },
  ];

  const adminSections: NavSection[] = [
    {
      title: 'Command Center',
      items: [
        { name: 'Executive Overview', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Patients', href: '/admin/patients', icon: Users },
        { name: 'Doctors & Staff', href: '/admin/doctors', icon: Stethoscope },
        { name: 'Departments', href: '/admin/departments', icon: Building2 },
        { name: 'All Appointments', href: '/admin/appointments', icon: Calendar },
      ],
    },
    {
      title: 'Finance & Operations',
      items: [
        { name: 'Financial Analytics', href: '/admin/finances', icon: DollarSign },
        { name: 'Payment Transactions', href: '/admin/payments', icon: CreditCard },
        { name: 'Salaries & Payroll', href: '/admin/salaries', icon: Banknote },
        { name: 'Staff Leave Approvals', href: '/admin/leave', icon: Plane, badge: '3' },
      ],
    },
    {
      title: 'Governance & Analytics',
      items: [
        { name: 'Patient Feedback', href: '/admin/feedback', icon: Star },
        { name: 'Reports Center', href: '/admin/reports', icon: BarChart2 },
        { name: 'Audit Logs', href: '/admin/audit-logs', icon: Shield },
        { name: 'Hospital Settings', href: '/admin/settings', icon: Settings2 },
      ],
    },
  ];

  const sections = user.role === 'doctor' ? doctorSections : user.role === 'admin' ? adminSections : patientSections;

  const handleLogout = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/auth/login');
  };

  const roleColors: Record<string, { bg: string; text: string; dot: string }> = {
    patient: { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', text: 'Patient Portal', dot: 'bg-blue-500' },
    doctor: { bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20', text: 'Physician Suite', dot: 'bg-teal-500' },
    admin: { bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', text: 'Hospital Admin', dot: 'bg-purple-500' },
  };

  const currentRoleStyle = roleColors[user.role] || roleColors.patient;

  return (
    <aside className="flex flex-col w-64 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 h-full select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-teal-500 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/20 ring-2 ring-white dark:ring-slate-900">
            <Heart className="w-4.5 h-4.5 text-white fill-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">Intercity</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-live-pulse" />
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Healthcare</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Context Card */}
      <div className="px-3.5 py-3 border-b border-slate-200/60 dark:border-slate-800/60 shrink-0">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
              {getInitials(user.displayName || 'U')}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
              {user.displayName}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn('inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium border', currentRoleStyle.bg)}>
                {currentRoleStyle.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {sections.map((section, idx) => (
          <div key={section.title || idx} className="space-y-1">
            {section.title && (
              <p className="px-3 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || (item.href !== `/${user.role}/dashboard` && location.pathname.startsWith(item.href));

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "group relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 outline-none",
                    item.highlight
                      ? isActive
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white shadow-md shadow-blue-500/20 font-semibold"
                        : "bg-gradient-to-r from-blue-50 via-teal-50/50 to-emerald-50/30 dark:from-blue-950/40 dark:via-teal-950/30 dark:to-emerald-950/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40 hover:border-blue-300 dark:hover:border-blue-700"
                      : isActive
                        ? "bg-blue-600 text-white shadow-sm font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105",
                      item.highlight
                        ? isActive ? 'text-white' : 'text-blue-600 dark:text-teal-400'
                        : isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    )}
                  />
                  <span className="flex-1 truncate tracking-tight">{item.name}</span>

                  {item.badge && (
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full tracking-tight",
                      item.highlight
                        ? "bg-white/25 text-white animate-pulse"
                        : isActive
                          ? "bg-white/20 text-white"
                          : item.badge === 'Live'
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Controls */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
