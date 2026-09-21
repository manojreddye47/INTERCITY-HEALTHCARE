import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { subscribeToAppointments } from '@/services/realtimeDb';
import { Appointment } from '@/types';

export default function DoctorCalendar() {
  const { user } = useAuthStore();
  const [view, setView] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const doctorId = user?.uid || 'doc-01';

  useEffect(() => {
    const unsubscribe = subscribeToAppointments({ doctorId }, (live) => {
      setAppointments(live);
    });
    return () => unsubscribe();
  }, [doctorId]);

  const handlePrev = () => {
    if (view === 'Day') setCurrentDate(subDays(currentDate, 1));
    if (view === 'Week') setCurrentDate(subWeeks(currentDate, 1));
    if (view === 'Month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNext = () => {
    if (view === 'Day') setCurrentDate(addDays(currentDate, 1));
    if (view === 'Week') setCurrentDate(addWeeks(currentDate, 1));
    if (view === 'Month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(a => isSameDay(new Date(a.date), date));
  };

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const renderDayView = () => {
    const dayApps = getAppointmentsForDay(currentDate);
    return (
      <div className="flex flex-col space-y-2">
        {timeSlots.map(hour => {
          const timeString = `${hour.toString().padStart(2, '0')}:00`;
          const slotApps = dayApps.filter(a => a.time.startsWith(timeString.substring(0, 2)));
          
          return (
            <div key={hour} className="flex border-b dark:border-gray-700 pb-2">
              <div className="w-20 text-sm text-gray-500 py-2">{hour > 12 ? `${hour-12} PM` : `${hour} AM`}</div>
              <div className="flex-1 min-h-[60px] relative border-l dark:border-gray-700 pl-4 py-1">
                {slotApps.map(app => (
                  <div 
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 p-2 rounded text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors mb-1"
                  >
                    <div className="font-semibold">{app.time} - Patient #{app.patientId}</div>
                    <div className="text-xs opacity-80">{app.appointmentType}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border dark:border-gray-700">
        {days.map(day => (
          <div key={day.toString()} className="bg-white dark:bg-gray-800 flex flex-col min-h-[400px]">
            <div className={`p-2 text-center text-sm font-medium border-b dark:border-gray-700 ${isToday(day) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''}`}>
              <div className="uppercase text-xs text-gray-500">{format(day, 'EEE')}</div>
              <div className="text-lg">{format(day, 'd')}</div>
            </div>
            <div className="flex-1 p-1 space-y-1 overflow-y-auto">
              {getAppointmentsForDay(day).map(app => (
                <div 
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 p-1 rounded text-xs cursor-pointer truncate"
                  title={`${app.time} - ${app.appointmentType}`}
                >
                  {app.time} {app.appointmentType}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: addDays(startDate, 41) }); // 6 weeks

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border dark:border-gray-700">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="bg-gray-50 dark:bg-gray-900 p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const apps = getAppointmentsForDay(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          return (
            <div 
              key={idx} 
              className={`min-h-[100px] p-2 bg-white dark:bg-gray-800 ${!isCurrentMonth ? 'opacity-50' : ''} ${isToday(day) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
            >
              <div className={`text-right text-sm mb-1 ${isToday(day) ? 'text-blue-600 font-bold' : ''}`}>
                {format(day, 'd')}
              </div>
              {apps.length > 0 && (
                <div className="space-y-1">
                  {apps.slice(0, 3).map(app => (
                    <div 
                      key={app.id} 
                      onClick={() => setSelectedApp(app)}
                      className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-[10px] p-1 rounded truncate cursor-pointer"
                    >
                      {app.time} - P#{app.patientId}
                    </div>
                  ))}
                  {apps.length > 3 && (
                    <div className="text-[10px] text-gray-500 font-medium pl-1">
                      +{apps.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-gray-500 dark:text-gray-400">View your schedule and availability.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4 border-b dark:border-gray-700 pb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold min-w-[200px]">
              {view === 'Day' && format(currentDate, 'MMMM d, yyyy')}
              {view === 'Week' && `${format(startOfWeek(currentDate, {weekStartsOn:1}), 'MMM d')} - ${format(addDays(startOfWeek(currentDate, {weekStartsOn:1}), 6), 'MMM d, yyyy')}`}
              {view === 'Month' && format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <Button variant="ghost" size="sm" onClick={handlePrev}><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" onClick={handleToday}>Today</Button>
              <Button variant="ghost" size="sm" onClick={handleNext}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {(['Day', 'Week', 'Month'] as const).map(v => (
              <Button 
                key={v}
                variant={view === v ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView(v)}
              >
                {v}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {view === 'Day' && renderDayView()}
          {view === 'Week' && renderWeekView()}
          {view === 'Month' && renderMonthView()}
        </CardContent>
      </Card>

      <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title="Appointment Info">
        {selectedApp && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-500">
              <CalendarIcon className="w-4 h-4" /> {format(new Date(selectedApp.date), 'MMMM d, yyyy')}
              <Clock className="w-4 h-4 ml-4" /> {selectedApp.time} (30m)
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-sm text-gray-500 block">Patient</span>
                <span className="font-medium">Patient #{selectedApp.patientId}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block">Status</span>
                <StatusBadge status={selectedApp.status as any} />
              </div>
              <div>
                <span className="text-sm text-gray-500 block">Type</span>
                <span className="font-medium">{selectedApp.appointmentType}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block">Reason</span>
                <span className="font-medium">{selectedApp.reason}</span>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setSelectedApp(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
