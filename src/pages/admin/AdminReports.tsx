import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FileText, Download, TrendingUp, Users, Activity, FileBarChart, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminReports() {
  const reports = [
    { id: 1, name: 'Appointment Summary', desc: 'Daily, weekly and monthly appointment statistics', icon: <Activity className="w-6 h-6 text-blue-500" />, date: 'Today, 08:00 AM', size: '2.4 MB' },
    { id: 2, name: 'Revenue & Financial', desc: 'Detailed breakdown of hospital earnings and pending dues', icon: <TrendingUp className="w-6 h-6 text-green-500" />, date: 'Yesterday, 11:30 PM', size: '4.1 MB' },
    { id: 3, name: 'Patient Growth', desc: 'New registrations, demographics and retention data', icon: <Users className="w-6 h-6 text-purple-500" />, date: '2 days ago', size: '1.8 MB' },
    { id: 4, name: 'Doctor Performance', desc: 'Consultation counts, ratings, and revenue generated per doctor', icon: <FileBarChart className="w-6 h-6 text-orange-500" />, date: '1 week ago', size: '3.2 MB' },
    { id: 5, name: 'Leave Analysis', desc: 'Staff availability and leave trends', icon: <FileText className="w-6 h-6 text-gray-500" />, date: '1 week ago', size: '1.1 MB' },
    { id: 6, name: 'Feedback Analysis', desc: 'Aggregated patient reviews and sentiment scores', icon: <MessageSquare className="w-6 h-6 text-pink-500" />, date: '2 weeks ago', size: '1.5 MB' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Reports & Analytics" description="Download hospital performance and analytical reports" />
        <button onClick={() => toast.success('Generating new report...')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => (
          <div key={report.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                {report.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{report.name}</h3>
                <p className="text-xs text-gray-500">Last generated: {report.date}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">{report.desc}</p>
            <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700 mt-auto">
              <span className="text-xs text-gray-500 font-medium">{report.size} • PDF</span>
              <button 
                onClick={() => toast.success(`Downloading ${report.name}.pdf`)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
