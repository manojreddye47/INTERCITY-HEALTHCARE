import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, FileText, CreditCard, User, 
  Activity, Bell, ChevronRight, Sparkles, Plus, ArrowRight,
  Heart, Download, ShieldCheck, MapPin, Video, AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';
import { demoPatient, demoAppointments, demoReports, demoPrescriptions } from '@/data/demo';
import { StatCard } from '@/components/shared/StatCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { subscribeToAppointments } from '@/services/realtimeDb';
import { Appointment } from '@/types';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = React.useState<Appointment[]>(demoAppointments);

  React.useEffect(() => {
    const unsub = subscribeToAppointments({ patientId: user?.uid || 'demo-patient' }, (list) => {
      if (list && list.length > 0) {
        setAppointments(list);
      }
    });

    return () => {
      unsub();
    };
  }, [user?.uid]);

  const upcomingAppointment = appointments.find(
    a => a.status === 'Confirmed' || a.status === 'Consultation Started' || a.status === 'Patient Arrived' || a.status === 'Scheduled'
  ) || appointments[0];
  const recentAppointments = appointments.slice(0, 4);

  const visitTrendData = [
    { month: 'May', consultations: 1 },
    { month: 'Jun', consultations: 2 },
    { month: 'Jul', consultations: 1 },
    { month: 'Aug', consultations: 3 },
    { month: 'Sep', consultations: appointments.length },
  ];

  return (
    <div className="space-y-6">
      {/* Patient Welcome Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-blue-100 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
              <span>Intercity Patient ID: #{demoPatient.id || 'PAT-1029'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {getGreeting()}, {demoPatient.name}!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Your health dashboard is up to date. You have <span className="font-bold text-white">1 upcoming consultation</span> scheduled this week.
            </p>

            {/* Vitals Quick Pills */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-semibold">
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur border border-white/15">
                Blood Group: <span className="text-white font-bold">{demoPatient.bloodGroup || 'O+'}</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur border border-white/15">
                Age: <span className="text-white font-bold">32 yrs</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur border border-white/15 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Vitals Verified</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <Link to="/patient/ai-booker">
              <Button className="w-full sm:w-auto h-11 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-xl text-xs px-4 shadow-lg active:scale-95 transition-all">
                <Sparkles className="w-4 h-4 mr-1.5 text-teal-600" />
                AI Smart Booking
              </Button>
            </Link>
            <Link to="/patient/book-appointment">
              <Button className="w-full sm:w-auto h-11 bg-blue-700/60 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs px-4 border border-white/20 active:scale-95 transition-all">
                <Plus className="w-4 h-4 mr-1" />
                New Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Clinical Telemetry & Vitals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Blood Pressure</span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">118/78 <span className="text-xs font-normal text-slate-400">mmHg</span></p>
          <span className="inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">Normal & Healthy</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Heart Rate</span>
            <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">72 <span className="text-xs font-normal text-slate-400">bpm</span></p>
          <span className="inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">Resting Optimal</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Blood Glucose</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">96 <span className="text-xs font-normal text-slate-400">mg/dL</span></p>
          <span className="inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">Fasting Normal</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Prescriptions</span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">{demoPrescriptions.length} <span className="text-xs font-normal text-slate-400">active</span></p>
          <Link to="/patient/prescriptions" className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline mt-1 block">
            View Dosages →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Next Appointment + Visit Trend */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointment Showcase Card */}
          {upcomingAppointment && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-live-pulse" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Confirmed Next Consultation
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                  {upcomingAppointment.appointmentType}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                    {upcomingAppointment.doctorName.split(' ')[1]?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {upcomingAppointment.doctorName}
                    </h3>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">{upcomingAppointment.departmentName}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {upcomingAppointment.date}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {upcomingAppointment.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  {upcomingAppointment.appointmentType === 'Video Consultation' ? (
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl gap-1">
                      <Video className="w-3.5 h-3.5" />
                      Join Call
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-xs rounded-xl font-semibold">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      OPD Wing 3
                    </Button>
                  )}
                  <Link to="/patient/appointments">
                    <Button size="sm" variant="ghost" className="text-xs rounded-xl font-medium w-full">
                      Reschedule
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Consultation History Chart */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Consultation Frequency
                </h3>
                <p className="text-xs text-slate-400">Total visits recorded over the last 5 months</p>
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                9 Total Visits
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="consultationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      fontSize: '12px',
                      color: '#fff'
                    }}
                  />
                  <Area type="monotone" dataKey="consultations" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#consultationGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Navigation + Recent Diagnostic Reports */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Quick Shortcuts
            </h3>
            <div className="space-y-2">
              <Link
                to="/patient/ai-booker"
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/40 dark:to-teal-950/40 border border-blue-200/50 dark:border-blue-900/40 hover:scale-[1.01] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-600 text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">AI Symptom Booker</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Describe symptoms in chat</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/patient/reports"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Lab Reports</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{demoReports.length} results ready</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/patient/payments"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Invoices & Bills</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">UPI / Card payments</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Recent Diagnostic Reports List */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Recent Diagnostic Reports
              </h3>
              <Link to="/patient/reports" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                All
              </Link>
            </div>

            <div className="space-y-2.5">
              {demoReports.slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{report.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{report.date} • {report.category}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0">
                    Ready
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
