import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Bell, Calendar, Activity, CheckCircle, Info, MessageSquare } from 'lucide-react';
import { subscribeToNotifications, markNotificationAsRead, RealtimeNotification } from '@/services/realtimeDb';

export function NotificationBell() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToNotifications(user.uid, (list) => {
      setNotifications(list);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
  };

  const markAllRead = async () => {
    notifications.filter(n => !n.read).forEach(n => {
      markNotificationAsRead(n.id);
    });
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'appointment': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'info': return <Info className="w-4 h-4 text-purple-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'feedback': return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'alert': return <Activity className="w-4 h-4 text-rose-500" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border-2 border-white dark:border-slate-900"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95">
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''}`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${!notification.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                      {notification.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
