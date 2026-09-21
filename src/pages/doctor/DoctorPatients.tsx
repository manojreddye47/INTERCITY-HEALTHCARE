import React, { useState } from 'react';
import { Search, Mail, Phone, Calendar, Clock } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { demoAppointments } from '@/data/demo';

const mockPatients = [
  { id: 'p1', name: 'Sneha Gupta', email: 'sneha@email.com', phone: '+91 98765 00001', lastVisit: '2024-08-15', totalVisits: 3, photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SnehaGupta&backgroundColor=b6e3f4' },
  { id: 'p2', name: 'Amit Joshi', email: 'amit@email.com', phone: '+91 98765 00002', lastVisit: '2024-09-01', totalVisits: 1, photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AmitJoshi&backgroundColor=c0aede' },
  { id: 'p3', name: 'Kavya Reddy', email: 'kavya@email.com', phone: '+91 98765 00003', lastVisit: '2024-09-10', totalVisits: 5, photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KavyaReddy&backgroundColor=ffd5dc' },
  { id: 'p4', name: 'Mohan Das', email: 'mohan@email.com', phone: '+91 98765 00004', lastVisit: '2024-08-20', totalVisits: 2, photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MohanDas&backgroundColor=b6e3f4' },
  { id: 'p5', name: 'Deepa Singh', email: 'deepa@email.com', phone: '+91 98765 00005', lastVisit: '2024-07-30', totalVisits: 4, photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DeepaSingh&backgroundColor=ffdfbf' },
];

export default function DoctorPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[0] | null>(null);

  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patientAppointments = selectedPatient ? demoAppointments.filter(apt => apt.patientName === selectedPatient.name) : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patients</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and view your patient records.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map(patient => (
          <div key={patient.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <img src={patient.photoURL} alt={patient.name} className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{patient.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Mail className="w-4 h-4" /> <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Phone className="w-4 h-4" /> <span>{patient.phone}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Last Visit</p>
                <p className="font-medium text-gray-900 dark:text-white">{patient.lastVisit}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Total Visits</p>
                <p className="font-medium text-gray-900 dark:text-white">{patient.totalVisits}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedPatient(patient)}
              className="mt-4 w-full py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium rounded-lg transition-colors"
            >
              View Details
            </button>
          </div>
        ))}
        {filteredPatients.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            No patients found matching your search.
          </div>
        )}
      </div>

      <Dialog.Root open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-50 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedPatient && (
              <div className="p-6">
                <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Patient Details</Dialog.Title>
                
                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                  <img src={selectedPatient.photoURL} alt={selectedPatient.name} className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPatient.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Mail className="w-4 h-4 text-gray-400" /> {selectedPatient.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4 text-gray-400" /> {selectedPatient.phone}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-400" /> Last: {selectedPatient.lastVisit}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-gray-400" /> Visits: {selectedPatient.totalVisits}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Appointment History</h3>
                  {patientAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {patientAppointments.map(apt => (
                        <div key={apt.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{apt.departmentName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{apt.date} at {apt.time}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            apt.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">No past appointments found.</p>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors">
                      Close
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
