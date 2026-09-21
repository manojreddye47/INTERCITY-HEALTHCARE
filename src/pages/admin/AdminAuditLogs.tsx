import React, { useState, useEffect } from 'react';
import { demoAuditLogs } from '@/data/demo';
import { AuditLog } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { format } from 'date-fns';
import { Search, Filter } from 'lucide-react';
import { subscribeToAuditLogs } from '@/services/realtimeDb';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>(demoAuditLogs);
  const [filterAction, setFilterAction] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsub = subscribeToAuditLogs((liveLogs) => {
      setLogs(liveLogs);
    });
    return () => unsub();
  }, []);

  const filtered = logs.filter(l => {
    if (filterAction !== 'ALL' && l.action !== filterAction) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (l.userName || '').toLowerCase().includes(term) ||
        (l.resource || '').toLowerCase().includes(term) ||
        (l.details || '').toLowerCase().includes(term) ||
        (l.action || '').toLowerCase().includes(term)
      );
    }
    return true;
  });

  const getBadgeColor = (action: string) => {
    switch(action) {
      case 'ADD': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'UPDATE': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'DELETE': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'APPROVE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'REJECT': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="System Audit Logs" description="Track and monitor administrative actions" />

      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white" 
          />
        </div>
        <select 
          className="border rounded-lg px-4 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          value={filterAction}
          onChange={e => setFilterAction(e.target.value)}
        >
          <option value="ALL">All Actions</option>
          <option value="ADD">Add</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="APPROVE">Approve</option>
          <option value="REJECT">Reject</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 whitespace-nowrap">{format(new Date(log.createdAt), 'dd MMM yyyy, HH:mm')}</td>
                  <td className="px-4 py-3 font-medium dark:text-white">{log.userName || log.userId}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">{log.resource}</td>
                  <td className="px-4 py-3 text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
