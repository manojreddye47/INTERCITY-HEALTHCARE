import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { demoDoctors, demoFeedback } from '@/data/demo';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Calendar, Clock, CheckCircle2, User, Star, Activity, 
  Stethoscope, FileText, Check, Play, AlertCircle, ChevronRight, Plus, XCircle, Edit3
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AppointmentStatus } from '@/types';
import { cn } from '@/lib/utils';
import { VitalsEditorModal } from '@/components/doctor/VitalsEditorModal';

interface DoctorPatientQueueItem {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  time: string;
  appointmentType: string;
  reason: string;
  status: AppointmentStatus;
  vitals: { bp: string; pulse: string; temp: string };
  avatar: string;
}

const INITIAL_QUEUE: DoctorPatientQueueItem[] = [
  {
    id: 'apt-01',
    patientName: 'Sneha Gupta',
    age: 29,
    gender: 'Female',
    time: '10:00 AM',
    appointmentType: 'In-person Consultation',
    reason: 'Follow-up for cardiac palpitations and fatigue',
    status: 'Patient Arrived',
    vitals: { bp: '122/80', pulse: '76 bpm', temp: '98.4°F' },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SnehaGupta&backgroundColor=b6e3f4',
  },
  {
    id: 'apt-02',
    patientName: 'Amit Joshi',
    age: 45,
    gender: 'Male',
    time: '10:30 AM',
    appointmentType: 'In-person Consultation',
    reason: 'Chest tightness after stair climbing',
    status: 'Scheduled',
    vitals: { bp: '138/88', pulse: '82 bpm', temp: '98.6°F' },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AmitJoshi&backgroundColor=c0aede',
  },
  {
    id: 'apt-03',
    patientName: 'Kavya Reddy',
    age: 38,
    gender: 'Female',
    time: '11:15 AM',
    appointmentType: 'Video Consultation',
    reason: 'Review of lipid panel diagnostic reports',
    status: 'Scheduled',
    vitals: { bp: '116/74', pulse: '68 bpm', temp: '98.2°F' },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KavyaReddy&backgroundColor=ffd5dc',
  },
  {
    id: 'apt-04',
    patientName: 'Mohan Das',
    age: 52,
    gender: 'Male',
    time: '11:45 AM',
    appointmentType: 'Follow-up',
    reason: 'Hypertension medication adjustment',
    status: 'Completed',
    vitals: { bp: '130/84', pulse: '72 bpm', temp: '98.6°F' },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MohanDas&backgroundColor=ffdfbf',
  },
];

import { subscribeToAppointments, updateAppointmentStatus } from '@/services/realtimeDb';

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const doctor = demoDoctors[0];

  const [queue, setQueue] = useState<DoctorPatientQueueItem[]>(INITIAL_QUEUE);
  const [activeConsultation, setActiveConsultation] = useState<DoctorPatientQueueItem | null>(null);
  const [editingVitalsItem, setEditingVitalsItem] = useState<DoctorPatientQueueItem | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [rxNotes, setRxNotes] = useState('');

  const handleSaveVitals = (updatedVitals: Record<string, string>) => {
    if (!editingVitalsItem) return;
    setQueue(prev => prev.map(item => {
      if (item.id === editingVitalsItem.id) {
        return {
          ...item,
          vitals: {
            bp: updatedVitals.bp || item.vitals.bp,
            pulse: updatedVitals.pulse || item.vitals.pulse,
            temp: updatedVitals.temp || item.vitals.temp,
            ...updatedVitals,
          },
        };
      }
      return item;
    }));

    if (activeConsultation && activeConsultation.id === editingVitalsItem.id) {
      setActiveConsultation(prev => prev ? {
        ...prev,
        vitals: {
          bp: updatedVitals.bp || prev.vitals.bp,
          pulse: updatedVitals.pulse || prev.vitals.pulse,
          temp: updatedVitals.temp || prev.vitals.temp,
          ...updatedVitals,
        },
      } : null);
    }
  };

  useEffect(() => {
    const unsub = subscribeToAppointments({ doctorId: doctor.id }, (appointments) => {
      if (appointments && appointments.length > 0) {
        const mappedQueue: DoctorPatientQueueItem[] = appointments.map((a, idx) => ({
          id: a.id,
          patientName: a.patientName || `Patient #${a.patientId}`,
          age: 28 + (idx * 5) % 30,
          gender: idx % 2 === 0 ? 'Female' : 'Male',
          time: a.time,
          appointmentType: a.appointmentType,
          reason: a.reason || 'Clinical Consultation',
          status: a.status,
          vitals: { bp: '120/80', pulse: '74 bpm', temp: '98.6°F' },
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(a.patientName || 'User')}&backgroundColor=b6e3f4`,
        }));
        setQueue(mappedQueue);
      }
    });

    return () => {
      unsub();
    };
  }, [doctor.id]);

  const handleStatusUpdate = async (id: string, status: AppointmentStatus) => {
    await updateAppointmentStatus(id, status);
    toast.success(`Patient queue updated: ${status}`);
  };

  const handleStartConsultation = async (patient: DoctorPatientQueueItem) => {
    await handleStatusUpdate(patient.id, 'Consultation Started');
    setActiveConsultation(patient);
    setClinicalNotes('');
    setRxNotes('');
  };

  const handleFinishConsultation = async () => {
    if (!activeConsultation) return;
    await handleStatusUpdate(activeConsultation.id, 'Completed');
    toast.success(`Consultation completed for ${activeConsultation.patientName}. Rx recorded.`);
    setActiveConsultation(null);
  };

  const chartData = [
    { name: 'Mon', completed: 8 },
    { name: 'Tue', completed: 11 },
    { name: 'Wed', completed: 14 },
    { name: 'Thu', completed: 9 },
    { name: 'Fri', completed: 12 },
    { name: 'Sat', completed: 6 },
  ];

  const waitingCount = queue.filter(a => a.status === 'Patient Arrived' || a.status === 'Consultation Started').length;
  const completedCount = queue.filter(a => a.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-600 via-blue-700 to-indigo-700 text-white shadow-xl shadow-teal-500/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-teal-100 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
            <span>OPD Clinical Suite • Room 304</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Welcome back, Dr. {user?.displayName || doctor.name}!
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm mt-1 max-w-xl">
            You have <span className="font-bold text-white">{queue.length} appointments</span> on your clinical schedule today. {waitingCount} patient(s) currently waiting in the lobby.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white/15 backdrop-blur border border-white/20 text-center">
            <span className="text-xs text-blue-100 block font-medium">On-Duty Shift</span>
            <span className="text-sm font-bold text-white">Morning (09:00 - 15:00)</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Consultations</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{queue.length}</p>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">Today's Roster</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Patients in Lobby</span>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{waitingCount}</p>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">Arrived & Ready</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed Today</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{completedCount}</p>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">Discharged / Rx Sent</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Satisfaction Score</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">4.9 ★</p>
          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mt-0.5 block">142 Reviews</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Patient Consultation Queue (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-live-pulse" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Live Outpatient Queue
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">Real-Time Patient Flow</span>
            </div>

            <div className="space-y-3">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                    item.status === 'Consultation Started'
                      ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/30"
                      : item.status === 'Patient Arrived'
                        ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800"
                        : "bg-slate-50/50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800"
                  )}
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={item.avatar}
                      alt={item.patientName}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.patientName}</h3>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.gender}, {item.age} yrs
                        </span>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.reason}</p>
                      
                      {/* Vitals snapshot */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-slate-500 font-medium mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.time}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                          BP: {item.vitals.bp}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                          Pulse: {item.vitals.pulse}
                        </span>
                        {item.vitals.temp && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                            Temp: {item.vitals.temp}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingVitalsItem(item)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 transition-colors font-semibold"
                          title="Edit patient vitals"
                        >
                          <Activity className="w-3 h-3" />
                          <span>Edit Vitals</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {item.status === 'Scheduled' && (
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(item.id, 'Patient Arrived')}
                          className="text-xs rounded-xl font-semibold text-teal-600 border-teal-200 hover:bg-teal-50"
                        >
                          Patient Arrived
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(item.id, 'Patient Did Not Arrive')}
                          className="text-xs rounded-xl font-semibold text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          No-Show
                        </Button>
                      </div>
                    )}
                    {item.status === 'Patient Arrived' && (
                      <Button
                        size="sm"
                        onClick={() => handleStartConsultation(item)}
                        className="text-xs rounded-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-sm"
                      >
                        <Play className="w-3 h-3 mr-1 fill-white" />
                        Start Visit
                      </Button>
                    )}
                    {item.status === 'Consultation Started' && (
                      <Button
                        size="sm"
                        onClick={() => setActiveConsultation(item)}
                        className="text-xs rounded-xl font-bold bg-blue-600 text-white"
                      >
                        Clinical Notes
                      </Button>
                    )}
                    {item.status === 'Patient Did Not Arrive' && (
                      <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1 px-3 py-1 bg-orange-50 dark:bg-orange-950/40 rounded-xl">
                        <XCircle className="w-3.5 h-3.5" />
                        No-Show
                      </span>
                    )}
                    {item.status === 'Completed' && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
                        <Check className="w-3.5 h-3.5" />
                        Done
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Productivity Analytics & Feedback (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Weekly Consultations Chart */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Consultations This Week
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="completed" fill="#0d9488" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Patient Reviews Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Recent Patient Feedback
              </h3>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>4.9 / 5.0</span>
              </div>
            </div>

            <div className="space-y-3">
              {demoFeedback.slice(0, 2).map((fb) => (
                <div key={fb.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">Patient #{fb.patientId}</span>
                    <span className="text-[10px] text-slate-400">{fb.createdAt}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 italic">"{fb.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Consultation & Prescription Modal */}
      <Modal
        isOpen={!!activeConsultation}
        onClose={() => setActiveConsultation(null)}
        title={`Clinical Encounter: ${activeConsultation?.patientName || ''}`}
        size="lg"
      >
        {activeConsultation && (
          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Patient Details</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {activeConsultation.patientName} ({activeConsultation.age}y, {activeConsultation.gender})
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 mb-0.5">
                  <span className="text-slate-400 block">Vitals Snapshot</span>
                  <button
                    type="button"
                    onClick={() => setEditingVitalsItem(activeConsultation)}
                    className="inline-flex items-center gap-0.5 text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  BP: {activeConsultation.vitals.bp} • Pulse: {activeConsultation.vitals.pulse}
                  {activeConsultation.vitals.temp ? ` • ${activeConsultation.vitals.temp}` : ''}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Clinical Examination & Diagnosis:
              </label>
              <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                rows={3}
                placeholder="E.g. Normal S1/S2 heart sounds, no peripheral edema. Mild stress-induced sinus tachycardia..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Prescription & Treatment Plan (Sent to Patient App):
              </label>
              <textarea
                value={rxNotes}
                onChange={(e) => setRxNotes(e.target.value)}
                rows={3}
                placeholder="E.g. 1. Metoprolol 25mg - 1 tablet OD after food x 14 days&#10;2. Repeat ECG in 2 weeks"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveConsultation(null)}
                className="rounded-xl text-xs"
              >
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={handleFinishConsultation}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Complete Consultation & Issue Rx
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <VitalsEditorModal
        isOpen={!!editingVitalsItem}
        onClose={() => setEditingVitalsItem(null)}
        patientName={editingVitalsItem?.patientName || ''}
        initialVitals={editingVitalsItem?.vitals || {}}
        onSave={handleSaveVitals}
      />
    </div>
  );
}
