import React, { useState, useEffect } from 'react';
import { demoAppointments } from '@/data/demo';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Search, Filter } from 'lucide-react';
import { format, isToday, isFuture, isPast } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { subscribeToAppointments, updateAppointmentStatus } from '@/services/realtimeDb';
import { Appointment } from '@/types';
import { toast } from 'sonner';

export default function DoctorAppointments() {
  const { user } = useAuthStore();
  const doctorId = user?.uid || 'doc-01';

  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(() =>
    demoAppointments.filter(a => a.doctorId === doctorId || a.doctorId === 'doc-01')
  );

  useEffect(() => {
    const unsub = subscribeToAppointments({ doctorId }, (list) => {
      const docList = list.filter(a => a.doctorId === doctorId || a.doctorId === 'doc-01');
      setAllAppointments(docList.length > 0 ? docList : list);
    });
    return () => unsub();
  }, [doctorId]);

  const filtered = allAppointments.filter(app => {
    // Tab filter
    if (tab === 'Today' && !isToday(new Date(app.date))) return false;
    if (tab === 'Upcoming' && (!isFuture(new Date(app.date)) || isToday(new Date(app.date)))) return false;
    if (tab === 'Past' && (!isPast(new Date(app.date)) || isToday(new Date(app.date)))) return false;
    if (tab === 'Cancelled' && app.status !== 'Cancelled') return false;

    // Search filter
    if (search && !app.patientId.toLowerCase().includes(search.toLowerCase())) return false;
    
    // Type filter
    if (typeFilter !== 'All' && app.appointmentType !== typeFilter) return false;

    return true;
  });

  const uniqueTypes = ['All', ...new Set(allAppointments.map(a => a.appointmentType))];

  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);

  const handleUpdateStatus = async (id: string, status: Appointment['status']) => {
    await updateAppointmentStatus(id, status);
    toast.success(`Appointment status updated to ${status}`);
    setSelectedApp(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Appointments</h1>
        <p className="text-gray-500 dark:text-gray-400">View and manage your complete appointment history.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto w-full md:w-auto">
          {['All', 'Today', 'Upcoming', 'Past', 'Cancelled'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                tab === t 
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search patient..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-900 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <tr>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Patient</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Reason</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">No appointments found.</td>
                  </tr>
                ) : (
                  filtered.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{format(new Date(app.date), 'MMM d, yyyy')}</div>
                        <div className="text-gray-500">{app.time} (30m)</div>
                      </td>
                      <td className="p-4 font-medium">
                        <div className="text-slate-900 dark:text-white font-semibold">{app.patientName || `Patient #${app.patientId}`}</div>
                        <div className="text-xs text-slate-400 font-mono">#{app.patientId}</div>
                      </td>
                      <td className="p-4">{app.appointmentType}</td>
                      <td className="p-4 max-w-[200px] truncate" title={app.reason}>{app.reason || 'Clinical Consultation'}</td>
                      <td className="p-4">
                        <StatusBadge status={app.status as any} />
                      </td>
                      <td className="p-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedApp(app)}
                          className="rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Manage Appointment Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Manage Patient Appointment</h3>
                <p className="text-xs text-slate-500">Reference: #{selectedApp.id}</p>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-slate-500 block mb-0.5">Patient Name</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedApp.patientName || `Patient #${selectedApp.patientId}`}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Current Status</span>
                  <StatusBadge status={selectedApp.status as any} />
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Scheduled Slot</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{format(new Date(selectedApp.date), 'MMMM d, yyyy')}</span>
                  <span className="text-slate-500 block">{selectedApp.time}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Type & Fee</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedApp.appointmentType}</span>
                  <span className="text-slate-500 block">₹{selectedApp.consultationFee}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1 font-semibold">Chief Reason / Complaint:</span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 italic border border-slate-200/60 dark:border-slate-700/60">
                  "{selectedApp.reason || 'General clinical consultation.'}"
                </p>
              </div>

              <div>
                <span className="text-slate-700 dark:text-slate-300 font-bold block mb-2">Update Clinical Status:</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Patient Arrived')}
                    className="text-xs rounded-xl font-semibold text-teal-600 border-teal-200 hover:bg-teal-50"
                  >
                    Mark Arrived
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Consultation Started')}
                    className="text-xs rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start Visit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Completed')}
                    className="text-xs rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Complete Visit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Patient Did Not Arrive')}
                    className="text-xs rounded-xl font-semibold text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    Mark No-Show
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Cancelled')}
                    className="text-xs rounded-xl font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedApp(null)}
                className="text-xs rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
