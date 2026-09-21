import React, { useState, useEffect } from 'react';
import { demoAppointments } from '@/data/demo';
import { Appointment } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Search, Filter, X, Calendar as CalIcon, Clock, User, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { subscribeToAppointments } from '@/services/realtimeDb';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(demoAppointments);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    const unsub = subscribeToAppointments({}, (list) => {
      setAppointments(list);
    });
    return () => unsub();
  }, []);

  const tabs = ['All', 'Today', 'Upcoming', 'Completed', 'Cancelled'];

  const filtered = appointments.filter(a => {
    if (search && !a.patientId.toLowerCase().includes(search.toLowerCase()) && !a.doctorId.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === 'Today' && a.date !== format(new Date(), 'yyyy-MM-dd')) return false;
    if (activeTab === 'Upcoming' && a.status !== 'Scheduled' && a.status !== 'Confirmed') return false;
    if (activeTab === 'Completed' && a.status !== 'Completed') return false;
    if (activeTab === 'Cancelled' && a.status !== 'Cancelled') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" description="Monitor and manage all hospital appointments" />

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 text-gray-600 dark:text-gray-300">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr 
                  key={a.id} 
                  onClick={() => setSelectedAppt(a)}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{a.id}</td>
                  <td className="px-4 py-3">{a.patientId}</td>
                  <td className="px-4 py-3">{a.doctorId}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span>{a.date}</span>
                      <span className="text-xs text-gray-500">{a.time}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      a.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      a.status === 'Scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">₹{a.consultationFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedAppt} onOpenChange={(o) => !o && setSelectedAppt(null)}>
        {selectedAppt && (
          <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <DialogTitle className="text-xl font-bold dark:text-white">Appointment Details</DialogTitle>
              <button onClick={() => setSelectedAppt(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Patient</div>
                  <div className="font-medium dark:text-white">{selectedAppt.patientId}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-sm text-gray-500">Doctor</div>
                  <div className="font-medium dark:text-white">{selectedAppt.doctorId}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <CalIcon className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium dark:text-white">{selectedAppt.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="text-sm text-gray-500">Time</div>
                    <div className="font-medium dark:text-white">{selectedAppt.time}</div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium capitalize dark:text-white">{selectedAppt.status}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium capitalize dark:text-white">{selectedAppt.appointmentType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold text-lg dark:text-white">₹{selectedAppt.consultationFee}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
