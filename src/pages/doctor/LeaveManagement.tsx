import React, { useState, useEffect } from 'react';
import { demoLeaves } from '@/data/demo';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import * as Dialog from '@radix-ui/react-dialog';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Calendar, Umbrella, Plus, FileText, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { subscribeToLeaves, submitLeaveRequest } from '@/services/realtimeDb';
import { Leave } from '@/types';

export default function LeaveManagement() {
  const { user } = useAuthStore();
  const doctorId = user?.uid || 'doc-01';
  const doctorName = user?.displayName || 'Dr. Rajesh Sharma';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>(() => demoLeaves.filter(l => l.doctorId === doctorId));
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Annual',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    const unsub = subscribeToLeaves((allLeaves) => {
      setLeaves(allLeaves.filter(l => l.doctorId === doctorId));
    });
    return () => unsub();
  }, [doctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('End date cannot be earlier than start date');
      return;
    }

    setSubmitting(true);
    try {
      await submitLeaveRequest({
        doctorId,
        doctorName,
        type: formData.type as 'Annual' | 'Sick' | 'Casual',
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        status: 'Pending',
      });
      toast.success('Leave request submitted in real time! Admin has been notified.');
      setIsModalOpen(false);
      setFormData({ type: 'Annual', startDate: '', endDate: '', reason: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const leaveBalances = [
    { type: 'Annual Leave', total: 20, used: 8, color: 'blue' },
    { type: 'Sick Leave', total: 10, used: 2, color: 'red' },
    { type: 'Casual Leave', total: 5, used: 2, color: 'green' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Request time off and view your leave history.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Request Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaveBalances.map((balance) => (
          <Card key={balance.type}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">{balance.type}</h3>
                <Umbrella className={`w-5 h-5 text-${balance.color}-500`} />
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold">{balance.total - balance.used}</span>
                <span className="text-gray-500 mb-1">days left</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`bg-${balance.color}-500 h-2 rounded-full`} 
                  style={{ width: `${(balance.used / balance.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{balance.used} days used out of {balance.total}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <tr>
                  <th className="p-4 font-medium">Leave Type</th>
                  <th className="p-4 font-medium">Duration</th>
                  <th className="p-4 font-medium">Days</th>
                  <th className="p-4 font-medium">Reason</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Admin Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">No leave records found.</td>
                  </tr>
                ) : (
                  leaves.map(leave => (
                    <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">{leave.type}</td>
                      <td className="p-4">
                        {format(new Date(leave.startDate), 'MMM d, yyyy')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                      </td>
                      <td className="p-4">{Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000*60*60*24)) + 1}</td>
                      <td className="p-4 max-w-[200px] truncate" title={leave.reason}>{leave.reason}</td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                          ${leave.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                          ${leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                          ${leave.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                        `}>
                          {leave.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                          {leave.status === 'Pending' && <Clock className="w-3 h-3" />}
                          {leave.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                          {leave.status}
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 italic">{leave.adminNote || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl z-50 w-full max-w-md">
            <Dialog.Title className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Request Leave</Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Leave Type</label>
                <select 
                  className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="Annual">Annual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Casual">Casual Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <Input 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <Input 
                    type="date" 
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason (Optional)</label>
                <textarea 
                  className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700 min-h-[100px]"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Briefly explain the reason for your leave..."
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t dark:border-gray-700">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </span>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
