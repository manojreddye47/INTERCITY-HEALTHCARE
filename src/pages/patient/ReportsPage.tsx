import React, { useState } from 'react';
import { FileText, Download, Eye, Search, Filter, Upload, FileHeart, Droplet, CheckCircle2, X } from 'lucide-react';
import { demoReports } from '@/data/demo';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Report } from '@/types';

export default function ReportsPage() {
  const [reports, setReports] = useState(demoReports);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newReportData, setNewReportData] = useState({
    name: '',
    category: 'Blood Test',
    hospital: 'Intercity Healthcare Central Diagnostics, Hyderabad'
  });

  const filteredReports = reports.filter(report => {
    const matchesTab = activeTab === 'all' || report.category.toLowerCase().includes(activeTab);
    const matchesSearch = report.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('blood')) return <Droplet className="w-5 h-5 text-red-500" />;
    if (category.toLowerCase().includes('imaging') || category.toLowerCase().includes('scan')) return <FileHeart className="w-5 h-5 text-blue-500" />;
    return <FileText className="w-5 h-5 text-slate-500" />;
  };

  const handleDownloadReport = (report: any) => {
    toast.success(`Downloading "${report.name}.pdf" from secure clinical vault...`);
    const dummyContent = `INTERCITY HEALTHCARE MULTI-SPECIALTY HOSPITAL\nHITEC City Medical Enclave, Hyderabad - 500081\nOFFICIAL DIAGNOSTIC REPORT\nReport: ${report.name}\nCategory: ${report.category}\nDate: ${report.date}\nFacility: ${report.hospital || 'Intercity Central Pathology & Diagnostics, Hyderabad'}\nCertified: Digitally Signed by Chief Pathologist\nAccreditation: NABL & NABH Accredited Laboratory`;
    const blob = new Blob([dummyContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_')}_Report.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportData.name.trim()) {
      toast.error('Please enter a report title');
      return;
    }
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      patientId: 'pat-01',
      name: newReportData.name,
      category: newReportData.category as any,
      date: new Date().toISOString().split('T')[0],
      hospital: newReportData.hospital,
      status: 'Available',
      fileUrl: '#',
      size: '2.4 MB',
      createdAt: new Date().toISOString()
    };
    setReports([newReport, ...reports]);
    toast.success(`Report "${newReportData.name}" uploaded and encrypted in your health locker.`);
    setShowUploadModal(false);
    setNewReportData({ name: '', category: 'Blood Test', hospital: 'Intercity Healthcare Diagnostics Center' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lab & Test Reports</h1>
          <p className="text-slate-500 dark:text-slate-400">View and download your medical reports.</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Report
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
          {['all', 'blood', 'imaging', 'checkup'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 font-bold' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {tab === 'all' ? 'All Reports' : tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search reports..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map(report => (
          <div key={report.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    {getCategoryIcon(report.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{report.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{report.category}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">Verified</span>
              </div>
              
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date Issued</span>
                  <span className="font-medium text-slate-900 dark:text-white">{format(new Date(report.date), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Diagnostic Center</span>
                  <span className="font-medium text-slate-900 dark:text-white truncate max-w-[150px]">{report.hospital || 'SmartCare Diagnostics'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={() => setSelectedReport(report)}
                className="flex-1 flex items-center justify-center space-x-1 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>
              <button 
                onClick={() => handleDownloadReport(report)}
                className="flex-1 flex items-center justify-center space-x-1 py-2 border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredReports.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No reports found</h3>
          <p className="text-slate-500 text-xs">Try adjusting your filters or search query.</p>
        </div>
      )}

      {/* Report Viewer Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedReport.name}</h3>
                <p className="text-xs text-slate-500">Digital Record ID: #{selectedReport.id}</p>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedReport.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date of Sampling:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{format(new Date(selectedReport.date), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Testing Laboratory:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedReport.hospital || 'SmartCare Pathology Division'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Accreditation:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> NABL Accredited & Verified
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Clinical Evaluation Summary:</span>
                <p className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 border border-blue-200 dark:border-blue-900/50">
                  All biochemical parameters tested fall within standard biological reference intervals. Doctor has reviewed and signed off on diagnostic findings.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-between">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => { handleDownloadReport(selectedReport); setSelectedReport(null); }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload Diagnostic Record</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Report Title</label>
                <input
                  type="text"
                  placeholder="e.g. Lipid Profile, Chest X-Ray"
                  value={newReportData.name}
                  onChange={e => setNewReportData({ ...newReportData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={newReportData.category}
                  onChange={e => setNewReportData({ ...newReportData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Blood Test">Blood Test</option>
                  <option value="Imaging & Scans">Imaging & Scans</option>
                  <option value="Annual Checkup">Annual Checkup</option>
                  <option value="Pathology">Pathology</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Issuing Hospital / Lab</label>
                <input
                  type="text"
                  value={newReportData.hospital}
                  onChange={e => setNewReportData({ ...newReportData, hospital: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
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
                  Upload & Encrypt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
