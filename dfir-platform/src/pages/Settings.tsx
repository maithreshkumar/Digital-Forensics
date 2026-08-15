import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Activity, Download, Search, Filter
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useStore } from '../store';

const tabs = [
  { id: 'profile', label: 'User Profile', icon: User },
  { id: 'audit', label: 'Audit Logs', icon: Activity },
];

const auditLogs = [
  { id: 'al-001', time: '2026-08-03 11:30', user: 'Dr. Sarah Mitchell', action: 'Viewed investigation workspace', resource: 'CASE-2026-0847', ip: '10.0.1.42', severity: 'info' },
  { id: 'al-002', time: '2026-08-03 11:15', user: 'Dr. Sarah Mitchell', action: 'Uploaded evidence file', resource: 'DC01-memory-dump.bin', ip: '10.0.1.42', severity: 'info' },
  { id: 'al-003', time: '2026-08-03 11:00', user: 'Agent Marcus Chen', action: 'Exported investigation report', resource: 'CASE-2026-0847 PDF', ip: '10.0.1.88', severity: 'info' },
  { id: 'al-004', time: '2026-08-03 10:45', user: 'System', action: 'Automated analysis step completed', resource: 'Memory Analysis Module', ip: 'internal', severity: 'success' },
  { id: 'al-005', time: '2026-08-03 10:30', user: 'Agent Lisa Park', action: 'Accessed evidence artifact', resource: 'ev-005 (phishing email)', ip: '10.0.1.55', severity: 'info' },
  { id: 'al-006', time: '2026-08-03 10:15', user: 'Dr. Sarah Mitchell', action: 'Modified investigation priority', resource: 'CASE-2026-0847 → CRITICAL', ip: '10.0.1.42', severity: 'warning' },
  { id: 'al-007', time: '2026-08-03 09:00', user: 'Admin', action: 'New user account created', resource: 'agent.chen@corp.com', ip: '10.0.1.1', severity: 'info' },
  { id: 'al-008', time: '2026-08-03 08:30', user: 'System', action: 'Platform Engine updated to v4.2.1', resource: 'Core Platform', ip: 'internal', severity: 'success' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'audit'>('profile');
  const { user } = useStore();
  const [auditSearch, setAuditSearch] = useState('');

  const filteredLogs = auditLogs.filter(log =>
    !auditSearch || log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.resource.toLowerCase().includes(auditSearch.toLowerCase())
  );

  const logSeverityColors: Record<string, string> = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
  };

  return (
    <AppLayout title="Settings & Audit Logs" breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Settings & Audit Logs' }]}>
      <div className="flex gap-1 mb-6 bg-white rounded-2xl border border-slate-100 card-shadow p-1.5 w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.id ? 'gradient-blue text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* PROFILE */}
        {activeTab === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex flex-col items-center text-center mb-5">
                  <div className="w-20 h-20 rounded-2xl gradient-blue flex items-center justify-center text-white text-2xl font-bold mb-3">SM</div>
                  <h3 className="font-bold text-slate-900">{user?.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                  <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full capitalize">{user?.role}</span>
                </div>
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  {[{ label: 'Department', value: 'Cyber Forensics Unit' }, { label: 'Clearance', value: 'SECRET' }, { label: 'Agent ID', value: 'CF-0042' }].map(i => (
                    <div key={i.label} className="flex justify-between text-xs">
                      <span className="text-slate-500">{i.label}</span>
                      <span className="font-semibold text-slate-800">{i.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <h3 className="font-semibold text-slate-900 mb-4 text-sm">Account Preferences</h3>
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <div>
                      <p className="font-semibold text-slate-800">Multi-Factor Authentication (MFA)</p>
                      <p className="text-slate-500 text-[11px]">Enforce hardware security key or TOTP</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-semibold rounded-full text-[10px]">ENABLED</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <div>
                      <p className="font-semibold text-slate-800">Email Alerts & Notifications</p>
                      <p className="text-slate-500 text-[11px]">Receive critical forensic alert emails</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-semibold rounded-full text-[10px]">ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AUDIT LOGS */}
        {activeTab === 'audit' && (
          <motion.div key="audit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-2xl border border-slate-100 card-shadow">
              <div className="flex items-center gap-3 p-4 border-b border-slate-100 flex-wrap">
                <div className="relative flex-1 min-w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={auditSearch} onChange={e => setAuditSearch(e.target.value)} placeholder="Search audit logs..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                  <Filter className="w-3.5 h-3.5" /> Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
                <span className="text-xs text-slate-500">{filteredLogs.length} entries</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold tracking-wide">
                      {['Timestamp', 'User', 'Action', 'Resource', 'IP Address', 'Severity'].map(h => (
                        <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.map((log, i) => (
                      <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-slate-500">{log.time}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{log.user}</td>
                        <td className="px-4 py-3 text-slate-600">{log.action}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-48 truncate">{log.resource}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">{log.ip}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${logSeverityColors[log.severity]}`}>{log.severity}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
