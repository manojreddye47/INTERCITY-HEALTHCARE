import React, { useState } from 'react';
import { demoLeaves, demoDoctors } from '@/data/demo';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { CheckCircle, XCircle, Clock, Calendar as CalendarIcon, User } from 'lucide-react';
import { format, parseISO, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { toast } from 'sonner';

import { subscribeToLeaves, approveLeaveRequest } from '@/services/realtimeDb';
import { Leave } from '@/types';

export default function AdminLeave() {
  const [leaves, setLeaves] = useState<Leave[]>(demoLeaves);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [adminNote, setAdminNote] = useState('');

  React.useEffect(() => {
    const unsub = subscribeToLeaves((list) => {
      setLeaves(list);
    });
    return () => unsub();
  }, []);

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  const allLeaves = [...leaves].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleApprove = async () => {
    if (!selectedLeave) return;
    await approveLeaveRequest(selectedLeave.id, 'Approved', adminNote);
    toast.success('Leave approved successfully in realtime!');
    setApproveModalOpen(false);
    setSelectedLeave(null);
    setAdminNote('');
  };

  const handleReject = async () => {
    if (!selectedLeave) return;
    if (!adminNote) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    await approveLeaveRequest(selectedLeave.id, 'Rejected', adminNote);
    toast.success('Leave rejected in realtime');
    setRejectModalOpen(false);
    setSelectedLeave(null);
    setAdminNote('');
  };

  // Simple calendar data
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getStaffOnLeave = (date: Date) => {
    return leaves.filter(l => {
      if (l.status !== 'Approved') return false;
      const start = parseISO(l.startDate);
      const end = parseISO(l.endDate);
      return date >= start && date <= end;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Leave Management</h1>
        <p className="text-gray-500 dark:text-gray-400">Review leave requests and monitor staff availability.</p>
      </div>

      {pendingLeaves.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-900/50">
          <CardHeader className="bg-yellow-50 dark:bg-yellow-900/10 border-b border-yellow-100 dark:border-yellow-900/50 pb-4">
            <CardTitle className="text-yellow-800 dark:text-yellow-500 flex items-center gap-2">
              <Clock className="w-5 h-5" /> Action Required: Pending Requests ({pendingLeaves.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-yellow-100 dark:divide-yellow-900/30">
              {pendingLeaves.map(leave => {
                const user = demoDoctors.find(d => d.id === leave.doctorId);
                return (
                  <div key={leave.id} className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex gap-4 items-start">
                      <Avatar src={user?.photoURL} fallback="User" />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{user?.name || leave.doctorId}</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          <span className="font-semibold">{leave.type}</span> • {Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000*60*60*24)) + 1} days
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4"/> {format(parseISO(leave.startDate), 'MMM d')} - {format(parseISO(leave.endDate), 'MMM d, yyyy')}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic bg-gray-50 dark:bg-gray-800/50 p-2 rounded border dark:border-gray-700">"{leave.reason}"</p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button 
                        variant="outline" 
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
                        onClick={() => { setSelectedLeave(leave); setRejectModalOpen(true); }}
                      >
                        <XCircle className="w-4 h-4 mr-1"/> Reject
                      </Button>
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => { setSelectedLeave(leave); setApproveModalOpen(true); }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1"/> Approve
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All Leave History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 border-b dark:border-gray-700 sticky top-0">
                  <tr>
                    <th className="p-4 font-medium">Staff</th>
                    <th className="p-4 font-medium">Type & Duration</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {allLeaves.map(leave => {
                    const user = demoDoctors.find(d => d.id === leave.doctorId);
                    return (
                      <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-4">
                          <div className="font-medium text-gray-900 dark:text-white">{user?.name || leave.doctorId}</div>
                          <div className="text-xs text-gray-500">{user?.specialty}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{leave.type} ({Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000*60*60*24)) + 1}d)</div>
                          <div className="text-xs text-gray-500">{format(parseISO(leave.startDate), 'MMM d')} - {format(parseISO(leave.endDate), 'MMM d, yy')}</div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            leave.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30' :
                            leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30'
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Availability - {format(today, 'MMMM')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Upcoming approved leaves in the next 7 days.</p>
              
              <div className="space-y-3">
                {daysInMonth.filter(d => d >= today && d <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)).map(day => {
                  const onLeave = getStaffOnLeave(day);
                  if (onLeave.length === 0) return null;
                  
                  return (
                    <div key={day.toISOString()} className="flex gap-3 text-sm p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border dark:border-gray-700">
                      <div className="w-12 text-center shrink-0">
                        <div className="font-bold text-gray-900 dark:text-white">{format(day, 'd')}</div>
                        <div className="text-xs text-gray-500 uppercase">{format(day, 'EEE')}</div>
                      </div>
                      <div className="flex-1 border-l dark:border-gray-600 pl-3">
                        {onLeave.map(l => (
                          <div key={l.id} className="text-gray-700 dark:text-gray-300">
                            {demoDoctors.find(d => d.id === l.doctorId)?.name || l.doctorId}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approve Modal */}
      <Modal isOpen={approveModalOpen} onClose={() => {setApproveModalOpen(false); setAdminNote('');}} title="Approve Leave">
        <div className="space-y-4">
          <p>Are you sure you want to approve this leave request?</p>
          <div>
            <label className="block text-sm font-medium mb-1">Add Note (Optional)</label>
            <Input value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="e.g. Approved, please ensure coverage." />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setApproveModalOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>Approve Request</Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={rejectModalOpen} onClose={() => {setRejectModalOpen(false); setAdminNote('');}} title="Reject Leave">
        <div className="space-y-4">
          <p>You are about to reject this leave request.</p>
          <div>
            <label className="block text-sm font-medium mb-1">Reason for Rejection (Required)</label>
            <textarea 
              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700 min-h-[100px]"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Explain why the leave is rejected..."
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleReject}>Reject Request</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
