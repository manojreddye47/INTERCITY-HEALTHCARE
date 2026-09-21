import React, { useState } from 'react';
import { demoDoctors } from '@/data/demo';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Search, Plus, Edit, Eye, ShieldAlert, CheckCircle, XCircle, Star, Phone, Mail, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDoctors() {
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState(demoDoctors.map(d => ({ ...d, status: 'Active', rating: 4.8, appointmentsThisMonth: Math.floor(Math.random() * 100) + 20 })));
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filtered = doctors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setDoctors(prev => prev.map(d => {
      if (d.id === id) {
        const newStatus = d.status === 'Active' ? 'Inactive' : 'Active';
        toast.success(`Doctor status changed to ${newStatus}`);
        return { ...d, status: newStatus };
      }
      return d;
    }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Doctor added successfully');
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doctors</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage hospital medical staff.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search doctors..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="shrink-0" onClick={() => setIsAddModalOpen(true)}><Plus className="w-4 h-4 mr-1"/> Add Doctor</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(doc => (
          <Card key={doc.id} className={`overflow-hidden transition-all ${doc.status === 'Inactive' ? 'opacity-75 grayscale-[50%]' : ''}`}>
            <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
              <div className="absolute -bottom-10 left-6">
                <Avatar src={doc.photoURL} size="xl" className="border-4 border-white dark:border-gray-800" fallback={doc.name.charAt(0)} />
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${doc.status === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {doc.status}
                </span>
              </div>
            </div>
            <CardContent className="pt-14 pb-6 px-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{doc.name}</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-4">{doc.specialty}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500"/> Rating</span>
                  <span className="font-semibold">{doc.rating} / 5</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Appts this month</span>
                  <span className="font-semibold">{doc.appointmentsThisMonth}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Consultation Fee</span>
                  <span className="font-semibold">₹{doc.consultationFee}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedDoctor(doc)}>Profile</Button>
                <Button 
                  variant={doc.status === 'Active' ? "outline" : "default"} 
                  size="sm" 
                  onClick={() => toggleStatus(doc.id)}
                  className={doc.status === 'Active' ? 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20' : ''}
                >
                  {doc.status === 'Active' ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!selectedDoctor} onClose={() => setSelectedDoctor(null)} title="Doctor Profile" size="lg">
        {selectedDoctor && (
          <div className="space-y-6">
            <div className="flex gap-6 items-start pb-6 border-b dark:border-gray-700">
              <Avatar src={selectedDoctor.photoURL} size="xl" className="w-24 h-24" fallback={selectedDoctor.name.charAt(0)} />
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{selectedDoctor.name}</h2>
                <p className="text-blue-600 dark:text-blue-400 font-medium">{selectedDoctor.specialty}</p>
                <div className="flex gap-4 mt-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1"><Mail className="w-4 h-4"/> {selectedDoctor.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-4 h-4"/> +91 9876543210</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedDoctor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {selectedDoctor.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2"><GraduationCap className="w-4 h-4"/> Qualifications</h3>
                <ul className="space-y-1 list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                  {selectedDoctor.qualifications.map((q: string, i: number) => <li key={i}>{q}</li>)}
                </ul>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Department ID</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedDoctor.departmentId}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Consultation Fee</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">₹{selectedDoctor.consultationFee}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
              <Button variant="outline" onClick={() => setSelectedDoctor(null)}>Close</Button>
              <Button><Edit className="w-4 h-4 mr-1"/> Edit Details</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Doctor">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input required placeholder="Dr. John Doe" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" required placeholder="john.doe@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Specialty</label>
              <Input required placeholder="e.g. Cardiologist" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" required>
                <option value="">Select Dept</option>
                <option value="dept-01">Cardiology</option>
                <option value="dept-02">Neurology</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Consultation Fee (₹)</label>
              <Input type="number" required placeholder="e.g. 500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Qualifications</label>
              <Input required placeholder="e.g. MBBS, MD" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Doctor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
