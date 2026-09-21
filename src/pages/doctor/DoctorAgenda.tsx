import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { format, isSameDay, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { AppointmentStatus, Appointment } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { subscribeToAppointments, updateAppointmentStatus } from '@/services/realtimeDb';

export default function DoctorAgenda() {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filter, setFilter] = useState('All');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState('');

  const doctorId = user?.uid || 'doc-01';

  useEffect(() => {
    const unsubscribe = subscribeToAppointments({ doctorId }, (live) => {
      setAppointments(live);
    });
    return () => unsubscribe();
  }, [doctorId]);

  const filteredAppointments = appointments.filter(a => {
    try {
      const isSame = isSameDay(parseISO(a.date), parseISO(selectedDate));
      if (!isSame) return false;
    } catch {
      if (a.date !== selectedDate) return false;
    }
    
    if (filter === 'All') return true;
    if (filter === 'Pending') return a.status === 'Scheduled' || a.status === 'Confirmed';
    if (filter === 'Arrived') return a.status === 'Patient Arrived' || a.status === 'Consultation Started';
    if (filter === 'Completed') return a.status === 'Completed';
    return true;
  });

  const handleStatusUpdate = async (id: string, status: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
      toast.success(`Status updated to ${status}`);
    } catch (e: any) {
      toast.error('Failed to update status: ' + (e.message || 'Error'));
    }
  };

  const handleSaveNotes = () => {
    if (selectedAppointment) {
      setAppointments(prev => prev.map(app => app.id === selectedAppointment.id ? { ...app, notes } : app));
      toast.success('Notes saved successfully');
      setSelectedAppointment(null);
    }
  };

  const openDetails = (app: Appointment) => {
    setSelectedAppointment(app);
    setNotes(app.notes || '');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Agenda</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your appointments for the day.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-0 bg-transparent p-0 h-auto focus:ring-0"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pb-2 overflow-x-auto">
        {['All', 'Pending', 'Arrived', 'Completed'].map(f => (
          <Button 
            key={f} 
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredAppointments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No appointments found for this filter.</div>
            ) : (
              filteredAppointments.map(app => (
                <div key={app.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex flex-col items-center sm:items-start min-w-[100px]">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
                      <Clock className="w-5 h-5" />
                      {app.time}
                    </div>
                    <span className="text-sm text-gray-500 mt-1">30 min</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <Avatar src={app.patientId} fallback="User" size="lg" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg">Patient #{app.patientId}</h3>
                        <StatusBadge status={app.status as any} />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{app.appointmentType} • {app.reason}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:min-w-[150px]">
                    {app.status === 'Scheduled' && (
                      <>
                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(app.id, 'Patient Arrived')}>Arrived</Button>
                        <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => handleStatusUpdate(app.id, 'Patient Did Not Arrive')}>No Show</Button>
                      </>
                    )}
                    {app.status === 'Patient Arrived' && (
                      <Button className="w-full" onClick={() => handleStatusUpdate(app.id, 'Consultation Started')}>Start</Button>
                    )}
                    {app.status === 'Consultation Started' && (
                      <Button className="w-full" onClick={() => handleStatusUpdate(app.id, 'Completed')}>Complete</Button>
                    )}
                    <Button variant="outline" className="w-full mt-auto" onClick={() => openDetails(app)}>Details</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Modal 
        isOpen={!!selectedAppointment} 
        onClose={() => setSelectedAppointment(null)}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar src={selectedAppointment.patientId} fallback="User" size="lg" />
              <div>
                <h3 className="font-bold text-lg">Patient #{selectedAppointment.patientId}</h3>
                <p className="text-gray-500">{selectedAppointment.date} at {selectedAppointment.time}</p>
              </div>
              <div className="ml-auto">
                <StatusBadge status={selectedAppointment.status as any} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500 block mb-1">Type</span>
                <span className="font-medium">{selectedAppointment.appointmentType}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">Reason</span>
                <span className="font-medium">{selectedAppointment.reason}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" /> Consultation Notes
              </label>
              <textarea 
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 min-h-[120px]"
                placeholder="Enter clinical notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
              <Button variant="outline" onClick={() => setSelectedAppointment(null)}>Cancel</Button>
              <Button onClick={handleSaveNotes}>Save Notes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
