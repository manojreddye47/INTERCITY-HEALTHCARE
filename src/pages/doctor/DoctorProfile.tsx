import React, { useState } from 'react';
import { demoDoctors } from '@/data/demo';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Camera, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function DoctorProfile() {
  const doctor = demoDoctors.find((d) => d.id === 'doc-01') || demoDoctors[0];
  const [activeTab, setActiveTab] = useState('Personal Info');
  
  const [formData, setFormData] = useState({
    name: doctor.name,
    email: doctor.email,
    phone: '+91 9876543210',
    specialty: doctor.specialty,
    departmentId: doctor.departmentId,
    experience: '12',
    bio: 'Experienced cardiologist with a demonstrated history of working in the hospital & health care industry. Skilled in Clinical Research, Medical Education, Pediatrics, Medicine, and Clinical Trials.',
    consultationFee: doctor.consultationFee,
    qualifications: [...doctor.qualifications]
  });

  const handleSave = () => {
    toast.success('Profile updated successfully');
  };

  const addQualification = () => {
    setFormData({ ...formData, qualifications: [...formData.qualifications, ''] });
  };

  const updateQualification = (index: number, value: string) => {
    const newQuals = [...formData.qualifications];
    newQuals[index] = value;
    setFormData({ ...formData, qualifications: newQuals });
  };

  const removeQualification = (index: number) => {
    const newQuals = [...formData.qualifications];
    newQuals.splice(index, 1);
    setFormData({ ...formData, qualifications: newQuals });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your personal and professional information.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 space-y-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4 group cursor-pointer">
                <Avatar src={doctor.photoURL} alt={doctor.name} size="xl" className="w-32 h-32" />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-lg">{doctor.name}</h3>
              <p className="text-sm text-gray-500">{doctor.specialty}</p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-1">
            {['Personal Info', 'Professional', 'Working Hours'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader className="border-b dark:border-gray-700">
              <CardTitle>{activeTab}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {activeTab === 'Personal Info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email Address</label>
                      <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Professional' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Specialty</label>
                      <Input value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Department</label>
                      <select 
                        className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.departmentId}
                        onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                      >
                        <option value="dept-01">Cardiology</option>
                        <option value="dept-02">Neurology</option>
                        <option value="dept-03">Pediatrics</option>
                        <option value="dept-04">Orthopedics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Years of Experience</label>
                      <Input type="number" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Consultation Fee (₹)</label>
                      <Input type="number" value={formData.consultationFee} onChange={(e) => setFormData({...formData, consultationFee: Number(e.target.value)})} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio / About</label>
                    <textarea 
                      className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700 min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">Qualifications</label>
                      <Button type="button" variant="ghost" size="sm" onClick={addQualification} className="text-blue-600">
                        <Plus className="w-4 h-4 mr-1"/> Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.qualifications.map((qual, idx) => (
                        <div key={idx} className="flex gap-2">
                          <Input 
                            value={qual} 
                            onChange={(e) => updateQualification(idx, e.target.value)} 
                            placeholder="e.g. MBBS, MD - Cardiology"
                          />
                          <Button type="button" variant="ghost" className="text-red-500 shrink-0" onClick={() => removeQualification(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {formData.qualifications.length === 0 && (
                        <p className="text-sm text-gray-500">No qualifications added.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Working Hours' && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Working hours configuration has been moved to a dedicated page.</p>
                  <Button variant="outline" onClick={() => window.location.href = '/doctor/working-hours'}>
                    Go to Working Hours
                  </Button>
                </div>
              )}

              {activeTab !== 'Working Hours' && (
                <div className="mt-8 flex justify-end pt-4 border-t dark:border-gray-700">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
