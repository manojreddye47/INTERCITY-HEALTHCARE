import React, { useState } from 'react';
import { CreditCard, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data in INR
  const payments = [
    { id: 'INV-2024-001', date: '2024-10-15', description: 'Cardiology Consultation', amount: 1500, status: 'paid' },
    { id: 'INV-2024-002', date: '2024-10-20', description: 'Blood Test Panel & Lipid Profile', amount: 850, status: 'paid' },
    { id: 'INV-2024-003', date: '2024-10-25', description: 'MRI Brain & Spine Scan', amount: 4500, status: 'pending' },
    { id: 'INV-2024-004', date: '2024-09-10', description: 'General Medicine Health Checkup', amount: 1000, status: 'refunded' },
  ];

  const chartData = [
    { month: 'Jun', amount: 1000 },
    { month: 'Jul', amount: 0 },
    { month: 'Aug', amount: 1500 },
    { month: 'Sep', amount: 1000 },
    { month: 'Oct', amount: 2350 },
  ];

  const [paymentList, setPaymentList] = useState(payments);
  const [activePayingItem, setActivePayingItem] = useState<any | null>(null);
  const [payMethod, setPayMethod] = useState<'upi' | 'card'>('upi');

  const filteredPayments = activeTab === 'all' ? paymentList : paymentList.filter(p => p.status === activeTab);

  const handleDownloadInvoice = (payment: any) => {
    toast.success(`Downloading Tax Invoice ${payment.id}.pdf...`);
    const invoiceTxt = `INTERCITY HEALTHCARE MULTI-SPECIALTY HOSPITALS\nHITEC City Medical Enclave, Madhapur, Hyderabad - 500081\nOFFICIAL TAX INVOICE: ${payment.id}\nDate: ${payment.date}\nService: ${payment.description}\nAmount: ${formatCurrency(payment.amount)}\nStatus: ${payment.status.toUpperCase()}\nPayment Ref: TXN-${Date.now().toString().slice(-6)}\nGSTIN: 36AAAAA0000A1Z5\nNABH Certified Hospital`;
    const blob = new Blob([invoiceTxt], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Intercity_Invoice_${payment.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfirmSettlement = () => {
    if (!activePayingItem) return;
    setPaymentList(prev => prev.map(p => 
      p.id === activePayingItem.id ? { ...p, status: 'paid' } : p
    ));
    toast.success(`Payment of ${formatCurrency(activePayingItem.amount)} for ${activePayingItem.id} confirmed!`);
    setActivePayingItem(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><CheckCircle className="w-3 h-3 mr-1" /> Paid</span>;
      case 'pending':
        return <span className="flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
      case 'refunded':
        return <span className="flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"><AlertCircle className="w-3 h-3 mr-1" /> Refunded</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payments & Invoices</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your billing history and pending payments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Paid (YTD)</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">₹2,350</p>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Pending Amount</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">₹4,500</p>
          </div>
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Recent Refunds</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">₹1,000</p>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex space-x-2 overflow-x-auto">
            {['all', 'paid', 'pending', 'refunded'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Invoice ID & Date</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{payment.id}</div>
                      <div className="text-xs text-slate-500">{format(new Date(payment.date), 'MMM d, yyyy')}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{payment.description}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{formatCurrency(payment.amount)}</td>
                    <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                    <td className="px-6 py-4 text-right">
                      {payment.status === 'pending' ? (
                        <button 
                          onClick={() => setActivePayingItem(payment)}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleDownloadInvoice(payment)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                          title="Download Tax Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPayments.length === 0 && (
              <div className="p-8 text-center text-slate-500">No {activeTab} payments found.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Payment History</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.1}}
                  formatter={(value: any) => [`₹${value}`, 'Amount']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payment Settlement Modal */}
      {activePayingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Hospital Payment Checkout</h3>
                <p className="text-xs text-slate-500">Invoice Ref: #{activePayingItem.id}</p>
              </div>
              <button 
                onClick={() => setActivePayingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 block text-[11px]">Payable For</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{activePayingItem.description}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[11px]">Total Due</span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">{formatCurrency(activePayingItem.amount)}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-700 dark:text-slate-300 font-bold block mb-2">Select Payment Method:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('upi')}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                      payMethod === 'upi'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    📱 UPI Instant (GPay / PhonePe / Paytm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('card')}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                      payMethod === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    💳 Debit/Credit Card & NetBanking
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-500">
                🔒 256-Bit SSL Encrypted Healthcare Transaction • Instant Digital Tax Receipt
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActivePayingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSettlement}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Pay {formatCurrency(activePayingItem.amount)} Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
