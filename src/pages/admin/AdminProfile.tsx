import React, { useState, useRef } from 'react';
import { 
  Shield, User, Mail, Phone, Building2, Key, Bell, CheckCircle2, 
  Save, Lock, ShieldCheck, FileCheck, Award, Clock, Camera
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export default function AdminProfile() {
  const { user, updateUserPhoto } = useAuthStore();
  const [activeTab, setActiveTab] = useState('executive');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateUserPhoto(dataUrl);
      toast.success('Admin profile picture updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  const [adminData, setAdminData] = useState({
    name: user?.displayName || 'Dr. Vikram Malhotra',
    email: user?.email || 'admin@intercity-healthcare.com',
    phone: '+91 (22) 2890-4100',
    roleTitle: 'Chief Medical Administrator & Clinical Director',
    staffId: 'ADM-EXEC-001',
    hospitalBranch: 'Intercity Healthcare Multi-Specialty Hospital (Central Campus, Mumbai)',
    licenseNumber: 'MCI-DIR-2018-94812',
    nabhAccreditation: 'NABH-H-2022-0941 (Valid thru 2027)',
    twoFactorEnabled: true,
    sessionTimeout: '30 minutes',
    criticalCapacityAlerts: true,
    physicianAbsenceAlerts: true,
    dailyFinancialDigest: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Hospital administrative profile & security policies saved successfully.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Executive Administrator Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your hospital command credentials, governance privileges, and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left ID Card & Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div 
              className="relative inline-block mb-3 group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload profile photo"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={adminData.name}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg mx-auto ring-2 ring-purple-500/30"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-lg mx-auto">
                  {adminData.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full border-2 border-white dark:border-slate-900 shadow-sm transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold block mx-auto mb-2"
            >
              Upload Picture
            </button>
            
            <h2 className="font-bold text-slate-900 dark:text-white text-base">
              {adminData.name}
            </h2>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
              {adminData.staffId}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Hospital Administrator
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" /> Level 4 SuperAdmin Clearance
              </span>
            </div>
          </div>

          <nav className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 space-y-1">
            {[
              { id: 'executive', label: 'Executive Info', icon: User },
              { id: 'hospital', label: 'Hospital Facility', icon: Building2 },
              { id: 'security', label: 'Security & Access', icon: Key },
              { id: 'alerts', label: 'Alert Preferences', icon: Bell },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Tab Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSave} className="space-y-6">
              {activeTab === 'executive' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Executive Identity & Contact
                    </h3>
                    <p className="text-xs text-slate-500">Official hospital credentials for regulatory compliance.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name & Title
                      </label>
                      <input
                        type="text"
                        value={adminData.name}
                        onChange={e => setAdminData({ ...adminData, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Official Designation
                      </label>
                      <input
                        type="text"
                        value={adminData.roleTitle}
                        onChange={e => setAdminData({ ...adminData, roleTitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Official Direct Email
                      </label>
                      <input
                        type="email"
                        value={adminData.email}
                        onChange={e => setAdminData({ ...adminData, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Emergency Executive Line
                      </label>
                      <input
                        type="text"
                        value={adminData.phone}
                        onChange={e => setAdminData({ ...adminData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hospital' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Hospital Facility Accreditation
                    </h3>
                    <p className="text-xs text-slate-500">Licensing authority credentials and campus information.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Campus Entity Name
                      </label>
                      <input
                        type="text"
                        value={adminData.hospitalBranch}
                        onChange={e => setAdminData({ ...adminData, hospitalBranch: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Medical Council Director License
                      </label>
                      <input
                        type="text"
                        value={adminData.licenseNumber}
                        readOnly
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        NABH / JCI Accreditation Certificate
                      </label>
                      <input
                        type="text"
                        value={adminData.nabhAccreditation}
                        readOnly
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Hospital Access & Security Controls
                    </h3>
                    <p className="text-xs text-slate-500">Enforce HIPAA and NABH compliance controls.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</p>
                        <p className="text-[11px] text-slate-500">Require TOTP hardware token for patient database queries</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Active & Enforced
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Automatic Security Lockout</p>
                        <p className="text-[11px] text-slate-500">Lock terminal when inactive</p>
                      </div>
                      <select
                        value={adminData.sessionTimeout}
                        onChange={e => setAdminData({ ...adminData, sessionTimeout: e.target.value })}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        <option value="15 minutes">15 minutes</option>
                        <option value="30 minutes">30 minutes</option>
                        <option value="1 hour">1 hour</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Hospital Telemetry Notifications
                    </h3>
                    <p className="text-xs text-slate-500">Configure which operational signals dispatch to your device.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">Critical Bed & ICU Capacity (&gt;90%)</p>
                        <p className="text-[11px] text-slate-500">Instant push notification on surge load</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={adminData.criticalCapacityAlerts}
                        onChange={e => setAdminData({ ...adminData, criticalCapacityAlerts: e.target.checked })}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">Physician Leave Approvals Pending</p>
                        <p className="text-[11px] text-slate-500">Alert when consultant doctors request duty coverage</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={adminData.physicianAbsenceAlerts}
                        onChange={e => setAdminData({ ...adminData, physicianAbsenceAlerts: e.target.checked })}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">Daily Financial Revenue Digest</p>
                        <p className="text-[11px] text-slate-500">Midnight automated billing and revenue settlement summary</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={adminData.dailyFinancialDigest}
                        onChange={e => setAdminData({ ...adminData, dailyFinancialDigest: e.target.checked })}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl px-5 h-10 shadow-md shadow-purple-500/20"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Save Executive Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
