import React, { useState } from 'react';
import { demoDepartments } from '@/data/demo';
import { Department } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Plus, Edit2, X, Power } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>(demoDepartments);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const toggleStatus = (dept: Department) => {
    setDepartments(prev => prev.map(d => 
      d.id === dept.id 
        ? { ...d, isActive: !d.isActive }
        : d
    ));
    toast.success('Department status updated');
  };

  const ModalForm = ({ dept, onClose }: { dept?: Department | null, onClose: () => void }) => (
    <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <DialogTitle className="text-lg font-bold dark:text-white">{dept ? 'Edit Department' : 'Add Department'}</DialogTitle>
        <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); toast.success(dept ? 'Department updated' : 'Department added'); onClose(); }} className="space-y-4">
        <input required placeholder="Name" defaultValue={dept?.name} className="w-full px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
        <textarea required placeholder="Description" defaultValue={dept?.description} className="w-full px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white" rows={3}></textarea>
        <input required placeholder="Icon Emoji" defaultValue={dept?.icon} className="w-full px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">Save</button>
      </form>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Departments" description="Manage hospital departments" />
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <div key={dept.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 ${!dept.isActive ? 'opacity-75' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
                {dept.icon}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${dept.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {dept.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{dept.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{dept.description}</p>
            
            <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium dark:text-gray-200 mb-6">
              {dept.doctorCount} Doctors
            </div>

            <div className="flex gap-2">
              <button onClick={() => setEditingDept(dept)} className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => toggleStatus(dept)} className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors">
                <Power className="w-4 h-4" /> {dept.isActive ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        {isAddModalOpen && <ModalForm onClose={() => setIsAddModalOpen(false)} />}
      </Dialog>
      <Dialog open={!!editingDept} onOpenChange={(o) => !o && setEditingDept(null)}>
        {editingDept && <ModalForm dept={editingDept} onClose={() => setEditingDept(null)} />}
      </Dialog>
    </div>
  );
}
