import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, User, Search, Filter, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import { demoAppointments } from '@/data/demo';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { subscribeToAppointments, updateAppointmentStatus } from '@/services/realtimeDb';
import { Appointment } from '@/types';

export default function MyAppointments() {
  const { user } = useAuthStore();
  const patientId = user?.uid || 'pat-01';

  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    demoAppointments.filter(a => a.patientId === patientId || a.patientId === 'pat-01')
  );
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = subscribeToAppointments({ patientId }, (list) => {
      // If list filtered by patientId has items, set it; otherwise fallback to showing patient's items or all if matched
      const userList = list.filter(a => a.patientId === patientId || a.patientId === 'pat-01');
      setAppointments(userList.length > 0 ? userList : list);
    });
    return () => unsub();
  }, [patientId]);

  const handleCancelAppointment = async (apptId: string) => {
    try {
      await updateAppointmentStatus(apptId, 'Cancelled', 'Cancelled by patient');
      toast.success('Appointment cancelled successfully');
    } catch {
      toast.error('Failed to cancel appointment');
    }
  };

  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter(apt => {
    const matchesTab = 
      (activeTab === 'upcoming' && (
        apt.status === 'Confirmed' || 
        apt.status === 'Scheduled' || 
        apt.status === 'Patient Arrived' || 
        apt.status === 'Consultation Started' ||
        apt.status === 'Rescheduled'
      )) ||
      (activeTab === 'completed' && apt.status === 'Completed') ||
      (activeTab === 'cancelled' && (apt.status === 'Cancelled' || apt.status === 'Patient Did Not Arrive'));
    
    const matchesSearch = (apt.doctorName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (apt.departmentName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const getStatusPill = (status: Appointment['status']) => {
    switch (status) {
      case 'Patient Arrived':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800"><span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" /> Checked In</span>;
      case 'Consultation Started':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> In Consultation</span>;
      case 'Completed':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Completed</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">Cancelled</span>;
      case 'Patient Did Not Arrive':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border border-orange-200 dark:border-orange-800">No-Show</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">Confirmed</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage your appointments.</p>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div className="flex space-x-6">
          {(['upcoming', 'completed', 'cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 -mb-4 px-1 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search doctor or dept..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
            />
          </div>
          <button className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(apt => (
            <div key={apt.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-blue-300 dark:hover:border-slate-500 transition-colors">
              <div className="flex items-center space-x-4">
                <img src={`https://i.pravatar.cc/150?u=${apt.doctorId}`} alt={apt.doctorName} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{apt.doctorName}</h3>
                    {getStatusPill(apt.status)}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{apt.departmentName}</p>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 md:px-8 w-full md:w-auto">
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{format(new Date(apt.date), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{apt.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 col-span-2 sm:col-span-1">
                  {apt.appointmentType === 'Video Consultation' ? <Video className="w-4 h-4 text-slate-400" /> : <User className="w-4 h-4 text-slate-400" />}
                  <span className="capitalize">{apt.appointmentType}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                {activeTab === 'upcoming' && (apt.status === 'Confirmed' || apt.status === 'Scheduled') && (
                  <button 
                    onClick={() => handleCancelAppointment(apt.id)}
                    className="px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                {activeTab === 'completed' && (
                  <button 
                    onClick={() => window.location.href = '/patient/feedback'}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    Give Feedback
                  </button>
                )}
                <button 
                  onClick={() => setSelectedAppt(apt)}
                  className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-sm font-medium rounded-lg transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No appointments found</h3>
            <p className="text-slate-500">You don't have any {activeTab} appointments.</p>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Appointment Details</h3>
                <p className="text-xs text-slate-500">Booking Reference: #{selectedAppt.id}</p>
              </div>
              <button 
                onClick={() => setSelectedAppt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-slate-500 block mb-0.5">Consultant Doctor</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedAppt.doctorName}</span>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 block">{selectedAppt.departmentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Current Status</span>
                  {getStatusPill(selectedAppt.status)}
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Date & Time</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{format(new Date(selectedAppt.date), 'MMMM d, yyyy')}</span>
                  <span className="text-slate-500 block">{selectedAppt.time}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Consultation Fee</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">₹{selectedAppt.consultationFee}</span>
                  <span className="text-emerald-600 capitalize block font-semibold">{selectedAppt.paymentStatus || 'Paid'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1 font-semibold">Chief Complaint / Clinical Reason:</span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 italic border border-slate-200/60 dark:border-slate-700/60">
                  "{selectedAppt.reason || 'Routine consultation and wellness evaluation.'}"
                </p>
              </div>

              {selectedAppt.notes && (
                <div>
                  <span className="text-slate-500 block mb-1 font-semibold">Doctor Clinical Notes:</span>
                  <p className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-900/50">
                    {selectedAppt.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedAppt(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
