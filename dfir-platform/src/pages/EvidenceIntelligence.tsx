import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Database, Search,
  User, Monitor, FileText, Globe, Usb, Shield,
  Tag, Eye, AlertTriangle, CheckCircle, Info, Hash, Calendar, Network
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useStore } from '../store';
import type { TimelineEvent } from '../types';

const eventTypeConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  login: { label: 'Login', color: 'text-blue-700', bg: 'bg-blue-100', icon: User },
  'file-create': { label: 'File Created', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: FileText },
  'file-delete': { label: 'File Deleted', color: 'text-red-700', bg: 'bg-red-100', icon: FileText },
  'usb-event': { label: 'USB Event', color: 'text-orange-700', bg: 'bg-orange-100', icon: Usb },
  'registry-change': { label: 'Registry', color: 'text-amber-700', bg: 'bg-amber-100', icon: Database },
  browser: { label: 'Browser', color: 'text-cyan-700', bg: 'bg-cyan-100', icon: Globe },
  malware: { label: 'Malware', color: 'text-red-700', bg: 'bg-red-100', icon: AlertTriangle },
  cloud: { label: 'Cloud', color: 'text-sky-700', bg: 'bg-sky-100', icon: Globe },
  auth: { label: 'Auth', color: 'text-violet-700', bg: 'bg-violet-100', icon: Shield },
  network: { label: 'Network', color: 'text-indigo-700', bg: 'bg-indigo-100', icon: Network },
  process: { label: 'Process', color: 'text-slate-700', bg: 'bg-slate-100', icon: Monitor },
};

const severityConfig: Record<string, { dot: string; row: string }> = {
  critical: { dot: 'bg-red-500', row: 'border-l-2 border-red-400 bg-red-50/30' },
  high: { dot: 'bg-orange-500', row: 'border-l-2 border-orange-400 bg-orange-50/20' },
  medium: { dot: 'bg-amber-500', row: 'border-l-2 border-amber-400' },
  low: { dot: 'bg-slate-300', row: '' },
  info: { dot: 'bg-blue-400', row: '' },
};

export default function EvidenceIntelligence() {
  const { timelineEvents, evidence } = useStore();
  const [activeTab, setActiveTab] = useState<'timeline' | 'details'>('timeline');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(timelineEvents[0]);
  const [selectedEvidence, setSelectedEvidence] = useState(evidence[0]);

  const filteredEvents = timelineEvents.filter(ev => {
    const matchSearch = !search || ev.description.toLowerCase().includes(search.toLowerCase()) || ev.actor?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filters.length === 0 || filters.includes(ev.type);
    return matchSearch && matchFilter;
  });

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'details', label: 'Evidence Details', icon: Eye },
  ];

  return (
    <AppLayout title="Evidence Intelligence" breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Evidence Intelligence' }]}>
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-white rounded-2xl border border-slate-100 card-shadow p-1.5 w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'gradient-blue text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow">
                {/* Controls */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-100 flex-wrap">
                  <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..."
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {['malware', 'auth', 'network', 'login', 'process'].map(f => (
                      <button key={f} onClick={() => setFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border capitalize transition-all ${filters.includes(f) ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-500 hover:border-blue-300'}`}>
                        {f}
                      </button>
                    ))}
                    {filters.length > 0 && <button onClick={() => setFilters([])} className="text-[10px] text-red-600 px-2 hover:underline">Clear</button>}
                  </div>
                  <span className="text-xs text-slate-500">{filteredEvents.length} events</span>
                </div>

                {/* Timeline events */}
                <div className="relative overflow-y-auto max-h-[600px]">
                  <div className="absolute left-[72px] top-0 bottom-0 w-0.5 bg-slate-100" />
                  {filteredEvents.map((ev, i) => {
                    const type = eventTypeConfig[ev.type] || eventTypeConfig.login;
                    const sev = severityConfig[ev.severity] || severityConfig.info;
                    const isSelected = selectedEvent?.id === ev.id;
                    return (
                      <motion.div key={ev.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                        onClick={() => setSelectedEvent(ev)}
                        className={`flex gap-4 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${sev.row} ${isSelected ? 'bg-blue-50' : ''}`}>
                        <div className="w-16 flex-shrink-0 text-right">
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <div className="relative flex-shrink-0 z-10 mt-1">
                          <div className={`w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${sev.dot}`}>
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${type.bg} ${type.color}`}>
                              {type.label}
                            </span>
                            <span className={`text-[9px] font-bold uppercase ${ev.severity === 'critical' ? 'text-red-600' : ev.severity === 'high' ? 'text-orange-600' : 'text-slate-400'}`}>
                              {ev.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 leading-relaxed">{ev.description}</p>
                          {ev.actor && <p className="text-[10px] text-slate-500 mt-0.5">Actor: <span className="font-mono text-slate-700">{ev.actor}</span></p>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Event Detail Panel */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5 sticky top-20">
                <h3 className="font-semibold text-slate-900 text-sm mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" /> Event Details
                </h3>
                {selectedEvent ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs font-semibold text-slate-800 mb-1">{selectedEvent.description}</p>
                      <p className="text-[10px] font-mono text-slate-500">{new Date(selectedEvent.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex justify-between py-1.5 border-b border-slate-100"><span className="text-slate-400">Event ID</span><span className="font-mono">{selectedEvent.id}</span></div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100"><span className="text-slate-400">Source</span><span className="font-medium">{selectedEvent.source}</span></div>
                      {selectedEvent.actor && <div className="flex justify-between py-1.5 border-b border-slate-100"><span className="text-slate-400">Actor</span><span className="font-mono">{selectedEvent.actor}</span></div>}
                      {selectedEvent.target && <div className="flex justify-between py-1.5 border-b border-slate-100"><span className="text-slate-400">Target</span><span className="font-mono text-blue-600">{selectedEvent.target}</span></div>}
                    </div>
                    {selectedEvent.metadata && (
                      <div className="p-3 bg-slate-900 rounded-xl text-emerald-400 font-mono text-[10px] overflow-x-auto">
                        <pre>{JSON.stringify(selectedEvent.metadata, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Select an event to view details</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* EVIDENCE DETAILS TAB */}
        {activeTab === 'details' && (
          <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-4 space-y-3">
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-4">
                <h3 className="font-semibold text-slate-900 text-sm mb-3">Evidence Artifacts</h3>
                <div className="space-y-2">
                  {evidence.map(ev => (
                    <button key={ev.id} onClick={() => setSelectedEvidence(ev)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${selectedEvidence.id === ev.id ? 'border-blue-300 bg-blue-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-800 truncate">{ev.name}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">{ev.trustScore}% trust</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="font-mono uppercase">{ev.type}</span>
                        <span>•</span>
                        <span>{(ev.size / (1024 * 1024)).toFixed(1)} MB</span>
                        <span className="ml-auto capitalize">{ev.status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full uppercase tracking-wider">{selectedEvidence.type}</span>
                    <h2 className="text-lg font-bold text-slate-900 mt-2">{selectedEvidence.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">ID: {selectedEvidence.id} • Added {new Date(selectedEvidence.uploadedAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">{selectedEvidence.trustScore}%</div>
                    <div className="text-xs text-slate-500">Integrity Score</div>
                  </div>
                </div>

                {/* Hashes */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 font-mono text-xs">
                  <h4 className="font-sans font-semibold text-slate-700 text-xs mb-2 font-mono uppercase tracking-wider">Cryptographic Hashes</h4>
                  <div className="flex gap-3"><span className="text-slate-400 w-16 flex-shrink-0">MD5</span><span className="text-slate-800 select-all">{selectedEvidence.hash.md5}</span></div>
                  <div className="flex gap-3"><span className="text-slate-400 w-16 flex-shrink-0">SHA-256</span><span className="text-slate-800 select-all">{selectedEvidence.hash.sha256}</span></div>
                  <div className="flex gap-3"><span className="text-slate-400 w-16 flex-shrink-0">SHA-512</span><span className="text-slate-800 select-all truncate">{selectedEvidence.hash.sha512}</span></div>
                </div>

                {/* Chain of Custody */}
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-3">Chain of Custody History</h4>
                  <div className="space-y-3">
                    {(selectedEvidence.chainOfCustody || []).map((item, i) => (
                      <div key={i} className="flex gap-4 items-start p-3 bg-slate-50 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                          {i + 1}
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="flex justify-between font-semibold text-slate-800">
                            <span className="capitalize">{item.action}</span>
                            <span className="text-slate-400 font-mono text-[10px]">{new Date(item.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-slate-600 mt-0.5">By {item.actor}</p>
                          <p className="text-slate-500 text-[11px] mt-1 italic">{item.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
