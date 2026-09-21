import React, { useState } from 'react';
import { 
  Banknote, Download, CheckCircle2, Clock, AlertCircle, 
  Search, Filter, Send, IndianRupee, Users, ArrowUpRight, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { demoDoctors } from '@/data/demo';
import { Button } from '@/components/ui/Button';

interface StaffPayrollItem {
  id: string;
  name: string;
  staffId: string;
  role: string;
  department: string;
  baseSalary: number;
  consultations: number;
  incentive: number;
  totalPayout: number;
  status: 'Disbursed' | 'Processing' | 'Pending';
  bankAccount: string;
}

export default function AdminSalaries() {
  const [filterDept, setFilterDept] = useState('All');
  const [search, setSearch] = useState('');
  
  // Seed initial payroll from doctors
  const [payrollList, setPayrollList] = useState<StaffPayrollItem[]>([
    {
      id: 'pay-1',
      name: 'Dr. Arjun Sharma',
      staffId: 'DOC-CARD-01',
      role: 'Senior Consultant Cardiologist',
      department: 'Cardiology',
      baseSalary: 280000,
      consultations: 42,
      incentive: 42000,
      totalPayout: 322000,
      status: 'Disbursed',
      bankAccount: 'HDFC •••• 4912'
    },
    {
      id: 'pay-2',
      name: 'Dr. Rajesh Kumar',
      staffId: 'DOC-ORTHO-02',
      role: 'Chief Orthopedic Surgeon',
      department: 'Orthopedics',
      baseSalary: 260000,
      consultations: 38,
      incentive: 38000,
      totalPayout: 298000,
      status: 'Pending',
      bankAccount: 'ICICI •••• 8102'
    },
    {
      id: 'pay-3',
      name: 'Dr. Priya Desai',
      staffId: 'DOC-PEDI-03',
      role: 'Pediatric Specialist',
      department: 'Pediatrics',
      baseSalary: 220000,
      consultations: 55,
      incentive: 44000,
      totalPayout: 264000,
      status: 'Disbursed',
      bankAccount: 'SBI •••• 3291'
    },
    {
      id: 'pay-4',
      name: 'Dr. Ananya Roy',
      staffId: 'DOC-NEURO-04',
      role: 'Senior Neurologist',
      department: 'Neurology',
      baseSalary: 310000,
      consultations: 29,
      incentive: 35000,
      totalPayout: 345000,
      status: 'Processing',
      bankAccount: 'AXIS •••• 1045'
    },
    {
      id: 'pay-5',
      name: 'Dr. Rohan Mehra',
      staffId: 'DOC-DERM-05',
      role: 'Consultant Dermatologist',
      department: 'Dermatology',
      baseSalary: 210000,
      consultations: 48,
      incentive: 38000,
      totalPayout: 248000,
      status: 'Pending',
      bankAccount: 'KOTAK •••• 7731'
    },
  ]);

  const handleDisburse = (id: string, name: string) => {
    setPayrollList(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'Disbursed' } : item
    ));
    toast.success(`Direct bank wire of salary disbursed to ${name}`);
  };

  const handleDisburseAllPending = () => {
    const pendingCount = payrollList.filter(p => p.status !== 'Disbursed').length;
    if (pendingCount === 0) {
      toast.info('All staff salaries for this cycle have already been disbursed.');
      return;
    }
    setPayrollList(prev => prev.map(item => ({ ...item, status: 'Disbursed' })));
    toast.success(`Batch NEFT/RTGS transaction initiated for ${pendingCount} medical staff accounts.`);
  };

  const handleExportCSV = () => {
    toast.success('Hospital_Payroll_Disbursal_Summary.csv exported successfully.');
  };

  const totalPayroll = payrollList.reduce((acc, p) => acc + p.totalPayout, 0);
  const totalDisbursed = payrollList.filter(p => p.status === 'Disbursed').reduce((acc, p) => acc + p.totalPayout, 0);
  const pendingCount = payrollList.filter(p => p.status !== 'Disbursed').length;

  const filtered = payrollList.filter(p => {
    if (filterDept !== 'All' && p.department !== filterDept) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.staffId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Medical Staff Salaries & Payroll
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automated physician compensation, OPD volume incentives, and direct bank disbursals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="text-xs font-semibold rounded-xl h-10 px-3.5"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV
          </Button>
          <Button
            onClick={handleDisburseAllPending}
            className="text-xs font-bold rounded-xl h-10 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Process All Pending ({pendingCount})
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-1">Total Monthly Budget</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">₹{(totalPayroll / 100000).toFixed(2)} Lakh</p>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 inline-block">FY 2024-25 Approved</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-1">Total Disbursed</p>
          <p className="text-2xl font-black text-emerald-600">₹{(totalDisbursed / 100000).toFixed(2)} Lakh</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">Settled to Doctors</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-1">Pending Approval / Hold</p>
          <p className="text-2xl font-black text-amber-600">{pendingCount} Physicians</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">Awaiting Admin Release</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-1">Average Consultant Package</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">₹2.95L / mo</p>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 inline-block">Includes OPD Incentives</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'Dermatology'].map(dept => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                filterDept === dept
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search physician or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 font-bold uppercase tracking-wider">Physician / Staff</th>
                <th className="p-4 font-bold uppercase tracking-wider">Department & Role</th>
                <th className="p-4 font-bold uppercase tracking-wider">Base Pay</th>
                <th className="p-4 font-bold uppercase tracking-wider">Incentive</th>
                <th className="p-4 font-bold uppercase tracking-wider">Net Disbursal</th>
                <th className="p-4 font-bold uppercase tracking-wider">Bank Account</th>
                <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</p>
                    <p className="text-[11px] text-purple-600 dark:text-purple-400 font-mono font-medium">{item.staffId}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{item.department}</p>
                    <p className="text-[11px] text-slate-400">{item.role}</p>
                  </td>
                  <td className="p-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                    ₹{item.baseSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    +₹{item.incentive.toLocaleString('en-IN')} ({item.consultations} consults)
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white text-sm">
                    ₹{item.totalPayout.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-[11px]">
                    {item.bankAccount}
                  </td>
                  <td className="p-4">
                    {item.status === 'Disbursed' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Disbursed
                      </span>
                    )}
                    {item.status === 'Processing' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        <Clock className="w-3 h-3" /> Processing
                      </span>
                    )}
                    {item.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        <AlertCircle className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {item.status !== 'Disbursed' ? (
                      <Button
                        size="sm"
                        onClick={() => handleDisburse(item.id, item.name)}
                        className="text-xs font-bold rounded-xl h-8 px-3 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Disburse
                      </Button>
                    ) : (
                      <span className="text-slate-400 text-xs font-medium">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
