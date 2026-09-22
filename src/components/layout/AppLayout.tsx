import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { TopBar } from './TopBar';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard, CalendarPlus, Sparkles, FileText, Menu,
  ClipboardList, Calendar, Users, DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const location = useLocation();

  // Bottom Navigation tabs for mobile
  const getMobileBottomNav = () => {
    if (!user) return [];
    if (user.role === 'doctor') {
      return [
        { name: 'Overview', href: '/doctor/dashboard', icon: LayoutDashboard },
        { name: 'Agenda', href: '/doctor/agenda', icon: ClipboardList },
        { name: 'Visits', href: '/doctor/appointments', icon: Calendar },
        { name: 'Patients', href: '/doctor/patients', icon: Users },
      ];
    }
    if (user.role === 'admin') {
      return [
        { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Visits', href: '/admin/appointments', icon: Calendar },
        { name: 'Patients', href: '/admin/patients', icon: Users },
        { name: 'Finance', href: '/admin/finances', icon: DollarSign },
      ];
    }
    // Default: Patient
    return [
      { name: 'Home', href: '/patient/dashboard', icon: LayoutDashboard },
      { name: 'Book', href: '/patient/book-appointment', icon: CalendarPlus, highlight: true },
      { name: 'Appointments', href: '/patient/appointments', icon: Calendar },
      { name: 'Records', href: '/patient/reports', icon: FileText },
    ];
  };

  const mobileTabs = getMobileBottomNav();

  return (
    <div className="flex h-screen bg-slate-50/60 dark:bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Quick-Action Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.href;

            return (
              <NavLink
                key={tab.href}
                to={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all",
                  tab.highlight && !isActive && "text-blue-600 dark:text-teal-400 font-semibold",
                  isActive
                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                <div className={cn(
                  "p-1 rounded-lg transition-transform",
                  isActive && "bg-blue-50 dark:bg-blue-950/50 scale-105"
                )}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5">{tab.name}</span>
              </NavLink>
            );
          })}

          {/* More Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            aria-label="More navigation items"
          >
            <div className="p-1 rounded-lg">
              <Menu className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">More</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
