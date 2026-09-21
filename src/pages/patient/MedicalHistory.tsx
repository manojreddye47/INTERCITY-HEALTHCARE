import React, { useState } from 'react';
import { format } from 'date-fns';
import { Activity, Stethoscope, Pill, FileText, Upload, ChevronDown, MoreVertical, X } from 'lucide-react';
import { demoPatient } from '@/data/demo';
import { toast } from 'sonner';

export default function MedicalHistory() {
  const [activeTab, setActiveTab] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    type: 'diagnosis',
    doctor: 'Dr. Arjun Sharma',
    dept: 'Cardiology',
    notes: ''
  });

  const [history, setHistory] = useState([
    { id: 1, type: 'diagnosis', date: '2023-10-15', title: 'Hypertension Diagnosed', doctor: 'Dr. Sarah Johnson', dept: 'Cardiology', notes: 'Patient showed elevated blood pressure over 3 visits. Prescribed Lisinopril.' },
    { id: 2, type: 'prescription', date: '2023-10-15', title: 'Lisinopril 10mg', doctor: 'Dr. Sarah Johnson', dept: 'Cardiology', notes: 'Take one tablet daily in the morning.' },
    { id: 3, type: 'procedure', date: '2023-05-20', title: 'MRI Scan - Right Knee', doctor: 'Dr. Emily Chen', dept: 'Orthopedics', notes: 'Minor meniscus tear detected. Physical therapy recommended.' },
    { id: 4, type: 'diagnosis', date: '2022-11-10', title: 'Seasonal Allergies', doctor: 'Dr. Michael Chen', dept: 'General Practice', notes: 'Allergic rhinitis. Recommended antihistamines during spring.' },
  ]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title.trim()) {
      toast.error('Please enter a document title');
      return;
    }
    const item = {
      id: Date.now(),
      type: newDoc.type,
      date: new Date().toISOString().split('T')[0],
      title: newDoc.title,
      doctor: newDoc.doctor,
      dept: newDoc.dept,
      notes: newDoc.notes || 'Document verified and uploaded by patient.'
    };
    setHistory([item, ...history]);
    toast.success(`Medical document "${newDoc.title}" archived successfully.`);
    setShowUploadModal(false);
    setNewDoc({ title: '', type: 'diagnosis', doctor: 'Dr. Arjun Sharma', dept: 'Cardiology', notes: '' });
  };

  const filteredHistory = activeTab === 'all' ? history : history.filter(h => h.type === activeTab);

  const getIcon = (type: string) => {
    switch(type) {
      case 'diagnosis': return <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'prescription': return <Pill className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'procedure': return <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default: return <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch(type) {
      case 'diagnosis': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'prescription': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'procedure': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Medical History</h1>
          <p className="text-slate-500 dark:text-slate-400">Your comprehensive health record.</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Current Conditions</h3>
            <div className="flex flex-wrap gap-2">
              {demoPatient.conditions?.map(cond => (
                <span key={cond} className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium border border-amber-200 dark:border-amber-800/50">
                  {cond}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Known Allergies</h3>
            <div className="flex flex-wrap gap-2">
              {demoPatient.allergies?.map(allergy => (
                <span key={allergy} className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium border border-red-200 dark:border-red-800/50">
                  {allergy}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Vitals Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Blood Group</span>
                <span className="font-semibold text-slate-900 dark:text-white">{demoPatient.bloodGroup}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Height</span>
                <span className="font-semibold text-slate-900 dark:text-white">175 cm</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Weight</span>
                <span className="font-semibold text-slate-900 dark:text-white">70 kg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex space-x-6 overflow-x-auto">
              {['all', 'diagnosis', 'prescription', 'procedure'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 -mb-4 px-1 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab 
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  {tab === 'all' ? 'All History' : `${tab}s`}
                </button>
              ))}
            </div>

            <div className="p-6">
              <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-8">
                {filteredHistory.map((item) => (
                  <div key={item.id} className="relative pl-8">
                    <div className="absolute -left-[11px] top-1 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-md capitalize ${getBadgeColor(item.type)}`}>
                            {item.type}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {format(new Date(item.date), 'MMMM d, yyyy')}
                          </span>
                        </div>
                        <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        {getIcon(item.type)}
                        {item.title}
                      </h4>
                      
                      <div className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                        <span className="font-medium text-slate-900 dark:text-white">{item.doctor}</span> • {item.dept}
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                        {item.notes}
                      </p>
                    </div>
                  </div>
                ))}
                {filteredHistory.length === 0 && (
                  <p className="text-slate-500 pl-8">No records found for this category.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload Medical Record</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Document / Condition Title</label>
                <input
                  type="text"
                  placeholder="e.g. Echocardiogram, Follow-up Assessment"
                  value={newDoc.title}
                  onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Record Type</label>
                <select
                  value={newDoc.type}
                  onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="diagnosis">Diagnosis</option>
                  <option value="prescription">Prescription</option>
                  <option value="procedure">Clinical Procedure</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Attending Doctor</label>
                  <input
                    type="text"
                    value={newDoc.doctor}
                    onChange={e => setNewDoc({ ...newDoc, doctor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newDoc.dept}
                    onChange={e => setNewDoc({ ...newDoc, dept: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Clinical Summary / Findings</label>
                <textarea
                  rows={3}
                  value={newDoc.notes}
                  onChange={e => setNewDoc({ ...newDoc, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Summary of medical findings..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save to Health Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
