import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Info, TrendingUp, TrendingDown, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function DoctorProductivity() {
  const kpis = [
    { label: 'Appointments Completed', value: '89', trend: '+12%', isPositive: true, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Cancellation Rate', value: '3.2%', trend: '-0.5%', isPositive: true, icon: XCircle, color: 'text-red-600' },
    { label: 'No-Show Rate', value: '2.1%', trend: '-1.1%', isPositive: true, icon: Users, color: 'text-yellow-600' },
    { label: 'Avg Consultation Time', value: '18 min', trend: '+2 min', isPositive: false, icon: Clock, color: 'text-blue-600' },
  ];

  const areaData = [
    { name: 'Mon', appointments: 12 },
    { name: 'Tue', appointments: 15 },
    { name: 'Wed', appointments: 18 },
    { name: 'Thu', appointments: 14 },
    { name: 'Fri', appointments: 16 },
    { name: 'Sat', appointments: 8 },
    { name: 'Sun', appointments: 4 },
  ];

  const barData = [
    { name: 'Week 1', completed: 65, cancelled: 4 },
    { name: 'Week 2', completed: 70, cancelled: 3 },
    { name: 'Week 3', completed: 68, cancelled: 5 },
    { name: 'Week 4', completed: 89, cancelled: 2 },
  ];

  const radialData = [
    { name: 'Utilized', value: 85, fill: '#3b82f6' },
    { name: 'Available', value: 15, fill: '#e5e7eb' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Productivity Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Track your operational metrics and consultation trends.</p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3 text-yellow-800 dark:text-yellow-200 text-sm">
        <Info className="w-5 h-5 shrink-0" />
        <p><strong>Disclaimer:</strong> These are operational metrics only and do not reflect clinical quality. They are intended to help you manage your time and schedule effectively.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 ${kpi.color}`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center text-sm font-medium ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.isPositive ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>}
                  {kpi.trend}
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Appointments This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="appointments" stroke="#3b82f6" fillOpacity={1} fill="url(#colorApps)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Working Hours Utilization</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={radialData}>
                  <RadialBar background dataKey="value" cornerRadius={10} />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">85%</span>
                <span className="text-sm text-gray-500">Booked</span>
              </div>
            </div>
            <div className="w-full mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Booked Time</span>
                <span className="font-medium">34h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div> Available Time</span>
                <span className="font-medium">6h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Completed vs Cancelled (Monthly Trend)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
