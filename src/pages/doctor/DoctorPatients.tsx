import React, { useState } from 'react';
import { Search, Mail, Phone, Calendar, Clock, Activity, Edit3, Plus, Heart } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { demoAppointments } from '@/data/demo';
import { VitalsEditorModal } from '@/components/doctor/VitalsEditorModal';

const mockPatients = [
  { id: 'p1', name: 'Sneha Gupta', email: 'sneha@email.com', phone: '+91 98765 00001', lastVisit: '2024-08-15', totalVisits: 3, photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SnehaGupta&backgroundColor=b6e3f4' },
  { id: 'p2', name: 'Amit Joshi', email: 'amit@email.com', phone: '+91 98765 00002', lastVisit: '2024-09-01', totalVisits: 1, photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AmitJoshi&backgroundColor=c0aede' },
  { id: 'p3', name: 'Kavya Reddy', email: 'kavya@email.com', phone: '+91 98765 00003', lastVisit: '2024-09-10', totalVisits: 5, photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KavyaReddy&backgroundColor=ffd5dc' },
  { id: 'p4', name: 'Mohan Das', email: 'mohan@email.com', phone: '+91 98765 00004', lastVisit: '2024-08-20', totalVisits: 2, photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MohanDas&backgroundColor=b6e3f4' },
  { id: 'p5', name: 'Deepa Singh', email: 'deepa@email.com', phone: '+91 98765 00005', lastVisit: '2024-07-30', totalVisits: 4, photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DeepaSingh&backgroundColor=ffdfbf' },
];

const INITIAL_VITALS: Record<string, Record<string, string>> = {
  p1: { bp: '120/80', pulse: '74 bpm', temp: '98.6°F', spo2: '99%', weight: '62 kg' },
  p2: { bp: '135/88', pulse: '82 bpm', temp: '98.4°F', spo2: '97%', weight: '78 kg' },
  p3: { bp: '118/76', pulse: '70 bpm', temp: '98.7°F', spo2: '99%', weight: '55 kg' },
  p4: { bp: '142/92', pulse: '86 bpm', temp: '99.1°F', spo2: '96%', weight: '84 kg' },
  p5: { bp: '124/82', pulse: '76 bpm', temp: '98.5°F', spo2: '98%', weight: '65 kg' },
};

export default function DoctorPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[0] | null>(null);
  const [patientVitals, setPatientVitals] = useState<Record<string, Record<string, string>>>(INITIAL_VITALS);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);

  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patientAppointments = selectedPatient ? demoAppointments.filter(apt => apt.patientName === selectedPatient.name) : [];
  const currentVitals = selectedPatient ? (patientVitals[selectedPatient.id] || { bp: '120/80', pulse: '72 bpm', temp: '98.6°F' }) : {};

  const handleSavePatientVitals = (newVitals: Record<string, string>) => {
    if (!selectedPatient) return;
    setPatientVitals(prev => ({
      ...prev,
      [selectedPatient.id]: newVitals,
    }));
  };

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
        {filteredPatients.map(patient => {
          const vitals = patientVitals[patient.id] || { bp: '120/80', pulse: '72 bpm' };
          return (
            <div key={patient.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
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

                {/* Vitals quick badge */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <Activity className="w-3.5 h-3.5 text-teal-600" /> Latest Vitals:
                  </span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    BP {vitals.bp || '120/80'} • {vitals.pulse || '72 bpm'}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Last Visit</p>
                    <p className="font-medium text-gray-900 dark:text-white">{patient.lastVisit}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total Visits</p>
                    <p className="font-medium text-gray-900 dark:text-white">{patient.totalVisits}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedPatient(patient)}
                className="mt-4 w-full py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium rounded-lg transition-colors"
              >
                View Details & Vitals
              </button>
            </div>
          );
        })}
        {filteredPatients.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            No patients found matching your search.
          </div>
        )}
      </div>

      <Dialog.Root open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedPatient && (
              <div className="p-6">
                <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Patient Record</Dialog.Title>
                
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  <img src={selectedPatient.photoURL} alt={selectedPatient.name} className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPatient.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-3 text-sm">
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

                {/* Vitals Management Section */}
                <div className="mb-6 p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/70 dark:border-teal-900/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">Patient Vitals</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsVitalsModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm shadow-teal-600/20"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Manage & Edit Vitals</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {Object.entries(currentVitals).map(([key, val]) => (
                      <div key={key} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-teal-900/40">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">{key}</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-teal-300 text-sm">{val}</span>
                      </div>
                    ))}
                    {Object.keys(currentVitals).length === 0 && (
                      <p className="col-span-full text-xs text-slate-400 py-2 text-center">No vitals recorded yet. Click "Manage & Edit Vitals" to add.</p>
                    )}
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

      {selectedPatient && (
        <VitalsEditorModal
          isOpen={isVitalsModalOpen}
          onClose={() => setIsVitalsModalOpen(false)}
          patientName={selectedPatient.name}
          initialVitals={currentVitals}
          onSave={handleSavePatientVitals}
        />
      )}
    </div>
  );
}
