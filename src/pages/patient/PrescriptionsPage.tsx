import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Printer, Download, Clock, Calendar } from 'lucide-react';
import { demoPrescriptions } from '@/data/demo';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function PrescriptionsPage() {
  const navigate = useNavigate();

  const handleDownloadRx = (prescription: any) => {
    toast.success('Downloading Official Rx Document (PDF)...');
    const dummyRx = `INTERCITY HEALTHCARE MULTI-SPECIALTY HOSPITAL\nHITEC City Medical Enclave, Hyderabad - 500081\nMEDICAL PRESCRIPTION\nDate: ${prescription.date}\nDoctor: Dr. Arjun Sharma (Senior Consultant - Cardiology)\nMedications: ${prescription.medications.map((m: any) => m.name + ' ' + m.dosage + ' (' + m.frequency + ')').join('\n')}\nNotes: ${prescription.notes || 'Take medications after meals. Follow up in 14 days.'}\nCertified: Digitally Signed by Clinical Consultant`;
    const blob = new Blob([dummyRx], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Intercity_Prescription_${prescription.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Prescriptions</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your active and past prescriptions.</p>
      </div>

      <div className="space-y-6">
        {demoPrescriptions.map(prescription => (
          <div key={prescription.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Prescribed on {format(new Date(prescription.date), 'MMMM d, yyyy')}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-900 dark:text-white">By Dr. Arjun Sharma</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <button 
                    onClick={() => navigate('/patient/appointments')}
                    className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
                  >
                    View Appointment
                  </button>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => window.print()}
                  title="Print Prescription"
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDownloadRx(prescription)}
                  title="Download PDF"
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 font-medium">Medication</th>
                    <th className="px-6 py-3 font-medium">Dosage</th>
                    <th className="px-6 py-3 font-medium">Frequency</th>
                    <th className="px-6 py-3 font-medium">Duration</th>
                    <th className="px-6 py-3 font-medium">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {prescription.medications.map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                            <Pill className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">{med.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{med.dosage}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                          {med.frequency}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                          {med.duration}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title={med.instructions}>
                        {med.instructions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {prescription.notes && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-t border-slate-200 dark:border-slate-700 text-sm">
                <span className="font-medium text-yellow-800 dark:text-yellow-500">Doctor's Note: </span>
                <span className="text-yellow-700 dark:text-yellow-600/80">{prescription.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
