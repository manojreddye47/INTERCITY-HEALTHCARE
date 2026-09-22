import React, { useState, useEffect } from 'react';
import { Bell, Calendar, CreditCard, FileText, CheckCircle2, Shield, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { subscribeToNotifications, markNotificationAsRead, markAllNotificationsAsRead, RealtimeNotification } from '@/services/realtimeDb';

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const userId = user?.uid || (user?.role ? `demo-${user.role}` : 'demo-patient');
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);

  useEffect(() => {
    const unsub = subscribeToNotifications(userId, (list) => {
      setNotifications(list);
    });
    return () => unsub();
  }, [userId]);

  const markAllAsRead = async () => {
    await markAllNotificationsAsRead(userId);
  };

  const handleItemClick = async (id: string) => {
    await markNotificationAsRead(id);
  };

  const filtered = activeFilter === 'all' ? notifications : notifications.filter(n => n.type === activeFilter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'report': return <FileText className="w-5 h-5 text-purple-500" />;
      case 'alert': return <Shield className="w-5 h-5 text-amber-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications Center</h1>
          <p className="text-slate-500 dark:text-slate-400">Live operational alerts and clinical notices.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4 mr-1.5" />
          Mark all as read
        </button>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['all', 'appointment', 'report', 'payment', 'reminder'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              activeFilter === filter 
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50">
        {filtered.map(notif => (
          <div 
            key={notif.id} 
            onClick={() => handleItemClick(notif.id)}
            className={`p-4 sm:p-6 flex items-start gap-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
              !notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
            }`}
          >
            <div className={`p-3 rounded-full shrink-0 ${!notif.read ? 'bg-white dark:bg-slate-800 shadow-sm' : 'bg-slate-100 dark:bg-slate-700'}`}>
              {getIcon(notif.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className={`text-sm sm:text-base font-semibold truncate ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                  {notif.title}
                </h3>
                <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
                  {formatDistanceToNow(new Date(notif.createdAt || Date.now()), { addSuffix: true })}
                </span>
              </div>
              <p className={`text-sm ${!notif.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                {notif.message}
              </p>
            </div>
            {!notif.read && (
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <Bell className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p>No notifications found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
