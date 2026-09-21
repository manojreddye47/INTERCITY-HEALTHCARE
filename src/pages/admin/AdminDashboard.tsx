import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { demoAppointments, demoDoctors, demoFeedback, demoLeaves } from '@/data/demo';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { 
  Users, Stethoscope, Calendar, CheckCircle2, Clock, 
  IndianRupee, CreditCard, UserMinus, Activity, ArrowUpRight, ArrowDownRight,
  TrendingUp, Download, ShieldCheck, Building2
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { subscribeToAppointments, subscribeToLeaves } from '@/services/realtimeDb';
import { Appointment, Leave } from '@/types';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);

  useEffect(() => {
    const unsubApp = subscribeToAppointments({}, (live) => {
      setAppointments(live);
    });
    const unsubLeaves = subscribeToLeaves((live) => {
      setLeaves(live);
    });
    return () => {
      unsubApp();
      unsubLeaves();
    };
  }, []);
  
  const monthlyRevenueData = [
    { name: 'Jan', revenue: 420000 },
    { name: 'Feb', revenue: 450000 },
    { name: 'Mar', revenue: 480000 },
    { name: 'Apr', revenue: 510000 },
    { name: 'May', revenue: 540000 },
    { name: 'Jun', revenue: 589000 },
  ];

  const appointmentTrendData = [
    { name: 'Mon', count: 45 },
    { name: 'Tue', count: 52 },
    { name: 'Wed', count: 48 },
    { name: 'Thu', count: 61 },
    { name: 'Fri', count: 59 },
    { name: 'Sat', count: 35 },
    { name: 'Sun', count: 12 },
  ];

  const departmentRevenueData = [
    { name: 'Cardiology', revenue: 165000 },
    { name: 'Orthopedics', revenue: 135000 },
    { name: 'Neurology', revenue: 98000 },
    { name: 'Pediatrics', revenue: 84000 },
    { name: 'Gynecology', revenue: 107000 },
  ];

  const patientGrowthData = [
    { name: 'Jan', patients: 950 },
    { name: 'Feb', patients: 1020 },
    { name: 'Mar', patients: 1105 },
    { name: 'Apr', patients: 1150 },
    { name: 'May', patients: 1190 },
    { name: 'Jun', patients: 1247 },
  ];

  const mockNames = ['Rahul Verma', 'Priya Sharma', 'Amit Kumar', 'Sneha Patel', 'Deepa Nair'];

  const recentAppointments = (appointments.length > 0 ? appointments : demoAppointments).slice(0, 5).map((app, idx) => ({
    ...app,
    patientName: mockNames[idx % mockNames.length]
  }));

  const recentFeedback = demoFeedback.slice(0, 4);
  const pendingLeaves = (leaves.length > 0 ? leaves : demoLeaves).filter(l => l.status === 'Pending').slice(0, 3);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayConsultationsCount = appointments.filter(a => a.date === todayStr).length || 28;

  const stats = [
    { label: 'Total Registered Patients', value: '1,247', icon: Users, trend: '+14.2%', isPositive: true, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/40' },
    { label: 'Active Physicians', value: demoDoctors.length.toString(), icon: Stethoscope, trend: '12 Specialties', isPositive: true, color: 'text-teal-600', bg: 'bg-teal-100 dark:bg-teal-900/40' },
    { label: "Today's Consultations", value: todayConsultationsCount.toString(), icon: Calendar, trend: 'Live Sync', isPositive: true, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/40' },
    { label: 'Monthly Revenue', value: '₹5.89L', icon: IndianRupee, trend: '+9.4%', isPositive: true, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white shadow-xl shadow-purple-500/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-purple-100 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
            <span>Hospital Command Center • All Systems Operational</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Executive Operations Dashboard
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm mt-1 max-w-xl">
            Real-time telemetry for hospital capacity, patient flow, daily revenues, and clinical staff rosters.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <Link to="/admin/reports">
            <Button className="h-11 bg-white hover:bg-purple-50 text-purple-700 font-bold rounded-xl text-xs px-4 shadow-lg active:scale-95">
              <Download className="w-4 h-4 mr-1.5" />
              Download Audit Report
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{stat.label}</span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Overview */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Revenue Trajectory</h2>
              <p className="text-xs text-slate-400">Monthly gross hospital collections (Past 6 months)</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl">
              +18.2% YTD
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminColorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={11} />
                <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={11} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#adminColorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Registrations Growth */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Active Patient Registrations</h2>
              <p className="text-xs text-slate-400">Cumulative patient network growth</p>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-xl">
              1,247 Total
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={11} />
                <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables & Staff Operations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Master Appointments (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Live Master Appointment Register
              </h2>
              <p className="text-xs text-slate-400">Recent consultation requests across departments</p>
            </div>
            <Link to="/admin/appointments" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800">
                <tr>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Physician</th>
                  <th className="p-3">Schedule</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentAppointments.map(app => {
                  const doc = demoDoctors.find(d => d.id === app.doctorId) || demoDoctors[0];
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{app.patientName}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">Dr. {doc.name}</td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-900 dark:text-white">{app.date}</span>
                        <span className="text-slate-400 block text-[10px]">{app.time}</span>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={app.status as any} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Leaves & Feedback (1 Col) */}
        <div className="space-y-6">
          {/* Staff Leave Approvals */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Pending Staff Leave
              </h3>
              <Link to="/admin/leave" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-2.5">
              {pendingLeaves.map(leave => {
                const doc = demoDoctors.find(d => d.id === leave.doctorId) || demoDoctors[0];
                return (
                  <div key={leave.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Dr. {doc.name}</h4>
                      <p className="text-[11px] text-slate-400">{leave.startDate} to {leave.endDate}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400">
                      Pending Review
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Hospital Reviews
              </h3>
              <span className="text-xs font-bold text-amber-500">4.8 ★ Avg</span>
            </div>

            <div className="space-y-2.5">
              {recentFeedback.slice(0, 2).map(fb => (
                <div key={fb.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">Patient #{fb.patientId}</span>
                    <span className="text-amber-500 font-bold">★ {fb.overallRating}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 italic line-clamp-2">"{fb.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
