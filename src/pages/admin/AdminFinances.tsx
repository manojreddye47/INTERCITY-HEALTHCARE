import React from 'react';
import { monthlyRevenueData, departmentRevenueData } from '@/data/demo';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IndianRupee, TrendingUp, Clock, RefreshCcw } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export default function AdminFinances() {
  const pieData = [
    { name: 'In-person', value: 65 },
    { name: 'Video', value: 20 },
    { name: 'Follow-up', value: 10 },
    { name: 'Emergency', value: 5 },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <PageHeader title="Financial Overview" description="Monitor hospital revenue and financial metrics" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue (YTD)" value="₹35.89L" icon={IndianRupee} trend={{ value: 12.5, isPositive: true }} />
        <StatCard title="This Month" value="₹5.89L" icon={TrendingUp} trend={{ value: 8.2, isPositive: true }} />
        <StatCard title="Pending Payments" value="₹94.5K" icon={Clock} />
        <StatCard title="Refunds Processed" value="₹12.0K" icon={RefreshCcw} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Department Revenue</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="department" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2 flex flex-col md:flex-row items-center justify-around">
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Revenue by Appointment Type</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-6 md:mt-0 space-y-4 px-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Yoy Growth</h4>
              <p className="text-2xl font-bold dark:text-white mt-1">+24.5%</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <h4 className="text-sm font-medium text-green-600 dark:text-green-400">Avg. Revenue Per Patient</h4>
              <p className="text-2xl font-bold dark:text-white mt-1">₹4,250</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400">Insurance Claim Success</h4>
              <p className="text-2xl font-bold dark:text-white mt-1">92%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
