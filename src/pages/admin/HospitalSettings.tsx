import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Save, Building2, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function HospitalSettings() {
  const [activeTab, setActiveTab] = useState('General');
  const tabs = ['General', 'Contact', 'Working Hours', 'Notifications'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Hospital Settings" description="Configure hospital information and preferences" />

      <div className="flex gap-2 overflow-x-auto border-b dark:border-gray-700 pb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        {activeTab === 'General' && (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-xs">Logo</span>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hospital Name</label>
                  <input type="text" defaultValue="Intercity Healthcare Multi-Specialty Hospital" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tagline</label>
                  <input type="text" defaultValue="Advanced Care, Compassionate Healing" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year Established</label>
                <input type="number" defaultValue="2010" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Bed Count</label>
                <input type="number" defaultValue="300" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Contact' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Complete Address</label>
              <textarea defaultValue="123 Health Avenue, Medical District, Cityville, State 12345" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white" rows={3}></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Main Phone</label>
                <input type="tel" defaultValue="+91 1800 123 4567" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Phone (24x7)</label>
                <input type="tel" defaultValue="+91 1800 999 9999" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white border-red-200 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Official Email</label>
                <input type="email" defaultValue="contact@smartcare.com" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website URL</label>
                <input type="url" defaultValue="https://smartcare-hospital.com" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'Working Hours' || activeTab === 'Notifications') && (
          <div className="py-8 text-center text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Settings for {activeTab} will appear here.</p>
          </div>
        )}

        <div className="pt-6 mt-6 border-t dark:border-gray-700 flex justify-end">
          <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
