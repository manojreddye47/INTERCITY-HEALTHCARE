import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Search, Plus, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const mockPatients = [
  { id: 'PAT-001', name: 'Rahul Verma', email: 'rahul.v@email.com', phone: '+91 98765 11111', joined: '2024-01-15', status: 'Active', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RahulVerma', dateOfBirth: '1985-06-15', gender: 'male', bloodGroup: 'B+', address: 'Pune, India' },
  { id: 'PAT-002', name: 'Priya Sharma', email: 'priya.s@email.com', phone: '+91 98765 22222', joined: '2024-02-10', status: 'Active', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma', dateOfBirth: '1992-09-22', gender: 'female', bloodGroup: 'O+', address: 'Delhi, India' },
  { id: 'PAT-003', name: 'Amit Kumar', email: 'amit.k@email.com', phone: '+91 98765 33333', joined: '2024-03-01', status: 'Active', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AmitKumar', dateOfBirth: '1978-11-05', gender: 'male', bloodGroup: 'A-', address: 'Mumbai, India' },
  { id: 'PAT-004', name: 'Sneha Patel', email: 'sneha.p@email.com', phone: '+91 98765 44444', joined: '2024-03-15', status: 'Inactive', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SnehaP', dateOfBirth: '1990-01-01', gender: 'female', bloodGroup: 'B+', address: 'Surat, India' },
  { id: 'PAT-005', name: 'Ravi Singh', email: 'ravi.s@email.com', phone: '+91 98765 55555', joined: '2024-04-01', status: 'Active', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RaviSingh', dateOfBirth: '1988-12-12', gender: 'male', bloodGroup: 'O-', address: 'Jaipur, India' },
  { id: 'PAT-006', name: 'Deepa Nair', email: 'deepa.n@email.com', phone: '+91 98765 66666', joined: '2024-05-20', status: 'Active', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DeepaNair', dateOfBirth: '1995-05-05', gender: 'female', bloodGroup: 'AB+', address: 'Kochi, India' },
  { id: 'PAT-007', name: 'Suresh Bhat', email: 'suresh.b@email.com', phone: '+91 98765 77777', joined: '2024-06-05', status: 'Active', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SureshBhat', dateOfBirth: '1980-08-08', gender: 'male', bloodGroup: 'A+', address: 'Bangalore, India' },
  { id: 'PAT-008', name: 'Anita Joshi', email: 'anita.j@email.com', phone: '+91 98765 88888', joined: '2024-07-12', status: 'Active', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnitaJoshi', dateOfBirth: '1991-07-07', gender: 'female', bloodGroup: 'B-', address: 'Lucknow, India' },
  { id: 'PAT-009', name: 'Mohan Rao', email: 'mohan.r@email.com', phone: '+91 98765 99999', joined: '2024-08-01', status: 'Inactive', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MohanRao', dateOfBirth: '1975-03-03', gender: 'male', bloodGroup: 'O+', address: 'Hyderabad, India' },
  { id: 'PAT-010', name: 'Kavya Reddy', email: 'kavya.r@email.com', phone: '+91 98765 10101', joined: '2024-09-05', status: 'Active', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KavyaReddy', dateOfBirth: '1998-10-10', gender: 'female', bloodGroup: 'A-', address: 'Chennai, India' },
];

export default function AdminPatients() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState(mockPatients);

  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = p.status === 'Active' ? 'Inactive' : 'Active';
        toast.success(`Patient status changed to ${newStatus}`);
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patients</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage hospital patient records.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search patients..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="shrink-0"><Plus className="w-4 h-4 mr-1"/> Add Patient</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Patients</p>
              <h3 className="text-2xl font-bold">{patients.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600">
              <span className="font-bold">Total</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Patients</p>
              <h3 className="text-2xl font-bold">{patients.filter(p => p.status === 'Active').length}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New This Month</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600">
              <Plus className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 border-b dark:border-gray-700">
                <tr>
                  <th className="p-4 font-medium">Patient</th>
                  <th className="p-4 font-medium">Contact Info</th>
                  <th className="p-4 font-medium">Blood Group</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map(patient => (
                  <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={patient.photoURL} fallback="User" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{patient.name}</div>
                          <div className="text-gray-500 text-xs">ID: {patient.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-900 dark:text-gray-300">{patient.phone}</div>
                      <div className="text-gray-500 text-xs">{patient.email}</div>
                    </td>
                    <td className="p-4 font-medium">{patient.bloodGroup}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(patient)}><Eye className="w-4 h-4"/></Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleStatus(patient.id)}>
                          {patient.status === 'Active' ? <XCircle className="w-4 h-4 text-red-500"/> : <CheckCircle className="w-4 h-4 text-green-500"/>}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
            {filtered.map(patient => (
              <div key={patient.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar src={patient.photoURL} fallback="User" />
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-xs text-gray-500">{patient.id}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {patient.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>{patient.phone}</p>
                  <p>{patient.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedPatient(patient)}>View</Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => toggleStatus(patient.id)}>Toggle Status</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)} title="Patient Details">
        {selectedPatient && (
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <Avatar src={selectedPatient.photoURL} size="xl" fallback="User" />
              <div>
                <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
                <p className="text-gray-500">{selectedPatient.id}</p>
                <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedPatient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedPatient.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">Email</span>
                <span className="font-medium">{selectedPatient.email}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Phone</span>
                <span className="font-medium">{selectedPatient.phone}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Date of Birth</span>
                <span className="font-medium">{selectedPatient.dateOfBirth}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Gender</span>
                <span className="font-medium capitalize">{selectedPatient.gender}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Blood Group</span>
                <span className="font-medium">{selectedPatient.bloodGroup}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 block mb-1">Address</span>
                <span className="font-medium">{selectedPatient.address}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
              <Button variant="outline" onClick={() => setSelectedPatient(null)}>Close</Button>
              <Button>Edit Patient</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
