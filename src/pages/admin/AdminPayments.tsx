import React, { useState } from 'react';
import { demoAppointments } from '@/data/demo';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Download, CreditCard, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

export default function AdminPayments() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Generate fake payments based on appointments
  const payments = demoAppointments.map((app, index) => {
    let status = 'pending';
    if (app.status === 'Completed') status = 'paid';
    if (app.status === 'Cancelled') status = 'refunded';

    return {
      id: `INV-${1000 + index}`,
      invoiceId: `INV-${1000 + index}`,
      appointmentId: app.id,
      patientName: `Patient #${app.patientId}`,
      patientEmail: `patient${app.patientId}@example.com`,
      description: `${app.appointmentType} Consultation`,
      amount: 500 + (index * 100), // mock amount
      date: app.date,
      createdAt: new Date().toISOString(),
      method: status === 'paid' ? (index % 2 === 0 ? 'UPI' : 'Credit Card') : '-',
      status
    };
  });

  const filtered = payments.filter(p => {
    if (filter !== 'All' && p.status !== filter.toLowerCase()) return false;
    if (search && !p.patientName.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleReminder = (email: string) => {
    toast.success(`Payment reminder sent to ${email}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage patient invoices and transactions.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto w-full md:w-auto">
          {['All', 'Paid', 'Pending', 'Refunded'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                filter === f 
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search invoice or patient..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 border-b dark:border-gray-700">
                <tr>
                  <th className="p-4 font-medium">Invoice</th>
                  <th className="p-4 font-medium">Patient</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Method</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">No payments found.</td>
                  </tr>
                ) : (
                  filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium text-blue-600 dark:text-blue-400">{p.id}</td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900 dark:text-white">{p.patientName}</div>
                        <div className="text-gray-500 text-xs">{p.patientEmail}</div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{p.description}</td>
                      <td className="p-4 text-gray-500">{format(parseISO(p.date), 'MMM d, yyyy')}</td>
                      <td className="p-4">
                        {p.method !== '-' && (
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <CreditCard className="w-3 h-3" /> {p.method}
                          </div>
                        )}
                        {p.method === '-' && <span className="text-gray-400">-</span>}
                      </td>
                      <td className="p-4 font-bold text-gray-900 dark:text-white">₹{p.amount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30' : 
                          p.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {p.status === 'pending' ? (
                          <Button variant="outline" size="sm" onClick={() => handleReminder(p.patientEmail)} className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 dark:border-yellow-900/50 dark:hover:bg-yellow-900/20">
                            <Bell className="w-4 h-4 mr-1"/> Remind
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">Receipt</Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
