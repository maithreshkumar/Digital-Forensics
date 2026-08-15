import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderSearch, Database, ClipboardList, FileBarChart, Zap,
  AlertTriangle, Trash2, X, Activity, Play, Plus, CheckCircle, Search
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatCard from '../components/shared/StatCard';
import InvestigationCard from '../components/shared/InvestigationCard';
import PipelineVisual from '../components/shared/PipelineVisual';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import type { Investigation } from '../types';

const livePipelineStages = [
  { label: 'User Prompt & Investigation Planning', status: 'complete' as const, detail: 'Intent analyzed • Scope extracted' },
  { label: 'Task Orchestration Engine', status: 'complete' as const, detail: '13 tasks orchestrated' },
  { label: 'Evidence Discovery & Collection', status: 'complete' as const, detail: '24 artifacts collected' },
  { label: 'Verification & Provenance Engine', status: 'complete' as const, detail: 'Trust score: 94%' },
  { label: 'Security & Zero Trust Layer', status: 'complete' as const, detail: 'All checks passed' },
  { label: 'Multi-Agent Investigation', status: 'running' as const, detail: 'Multi-agent analysis active' },
  { label: 'Reasoning & Hypothesis Engine', status: 'pending' as const, detail: 'Awaiting agent results' },
  { label: 'Verification Engine', status: 'pending' as const },
  { label: 'Explainable Reporting Engine', status: 'pending' as const },
  { label: 'Final Investigation Report', status: 'pending' as const },
];

export default function Dashboard() {
  const { investigations, evidence, deleteInvestigation, addInvestigation, addNotification, setActiveInvestigation } = useStore();
  const navigate = useNavigate();

  const [investigationToDelete, setInvestigationToDelete] = useState<Investigation | null>(null);
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickType, setQuickType] = useState<Investigation['type']>('ransomware');
  const [quickPriority, setQuickPriority] = useState<Investigation['priority']>('high');
  const [searchFilter, setSearchFilter] = useState('');

  const confirmDelete = () => {
    if (investigationToDelete) {
      deleteInvestigation(investigationToDelete.id);
      setInvestigationToDelete(null);
    }
  };

  const handleStartQuickInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    const caseNum = Math.floor(1000 + Math.random() * 9000);
    const newInv: Investigation = {
      id: `inv-${Date.now()}`,
      name: quickName.trim(),
      caseId: `CASE-2026-${caseNum}`,
      priority: quickPriority,
      type: quickType,
      status: 'analyzing',
      description: `Autonomous DFIR investigation for ${quickName.trim()}.`,
      prompt: `Autonomous forensic triage and investigation for ${quickName.trim()}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: 'Dr. Sarah Mitchell',
      trustScore: 94,
      confidence: 90,
      progress: 25,
      evidenceCount: 2,
      agentsActive: 4,
      findings: [],
    };

    addInvestigation(newInv);
    setActiveInvestigation(newInv);
    addNotification({
      id: `n-${Date.now()}`,
      type: 'success',
      title: 'Investigation Started',
      message: `${newInv.name} (${newInv.caseId}) has been added to active investigations list.`,
      timestamp: new Date().toISOString(),
      read: false,
      investigationId: newInv.id,
    });

    setQuickName('');
    setIsQuickModalOpen(false);
  };

  const filteredInvestigations = investigations.filter(inv =>
    inv.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    inv.caseId.toLowerCase().includes(searchFilter.toLowerCase()) ||
    inv.type.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <AppLayout title="Security Operations Dashboard" breadcrumbs={[{ label: 'Dashboard' }]}>
      {/* Top Area — 4 Statistics Cards in 1 horizontal row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Investigations"
          value={investigations.filter(i => i.status !== 'complete' && i.status !== 'archived').length}
          icon={<FolderSearch className="w-5 h-5" />}
          color="#2563eb"
          bgColor="bg-blue-50"
          badge={`${investigations.filter(i => i.status !== 'complete' && i.status !== 'archived').length} Active`}
          badgeColor="bg-blue-100 text-blue-700"
          animated
        />
        <StatCard
          title="Evidence Files"
          value={evidence.length}
          icon={<Database className="w-5 h-5" />}
          color="#0ea5e9"
          bgColor="bg-sky-50"
          animated
        />
        <StatCard
          title="Investigation Queue"
          value={investigations.length}
          icon={<ClipboardList className="w-5 h-5" />}
          color="#f59e0b"
          bgColor="bg-amber-50"
          animated
        />
        <StatCard
          title="Reports Generated"
          value={7}
          icon={<FileBarChart className="w-5 h-5" />}
          color="#10b981"
          bgColor="bg-emerald-50"
          animated
        />
      </div>

      {/* Main Content Section — Side-by-Side Responsive Two-Column Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT COLUMN — Live Investigation Pipeline (45-50% width / col-span-5) */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-5 bg-white rounded-2xl border border-slate-100 card-shadow p-5 h-[680px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Live Investigation Pipeline</h3>
                <p className="text-[11px] text-slate-500">Project Nightfall</p>
              </div>
            </div>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-[10px] font-semibold text-blue-600">LIVE</span>
            </motion.div>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <PipelineVisual stages={livePipelineStages} />
          </div>
        </div>

        {/* RIGHT COLUMN — Recent Investigations (50-55% width / col-span-7) */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-7 bg-white rounded-2xl border border-slate-100 card-shadow p-5 h-[680px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-3 flex-shrink-0 gap-3">
            <div>
              <h2 className="font-semibold text-slate-900 text-sm">All Investigations ({investigations.length})</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Active and historical forensic cases</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQuickModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-emerald-600/20 active:scale-95 cursor-pointer"
                title="Start a new investigation and add to list"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Start Investigation
              </button>
              <button
                onClick={() => navigate('/new-investigation')}
                className="flex items-center gap-1.5 px-3 py-2 gradient-blue text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
                title="Full investigation planning workflow"
              >
                <Plus className="w-3.5 h-3.5" /> New Case
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-3 flex-shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search investigations by name, case ID, or type..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInvestigations.map((inv) => (
                <InvestigationCard
                  key={inv.id}
                  investigation={inv}
                  compact
                  onDelete={(_e, caseToDelete) => setInvestigationToDelete(caseToDelete)}
                />
              ))}
              {filteredInvestigations.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-400 text-xs">
                  No investigations matching your criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Investigation Modal */}
      <AnimatePresence>
        {isQuickModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 card-shadow border border-slate-100 relative"
            >
              <button
                onClick={() => setIsQuickModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Play className="w-5 h-5 fill-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Start Investigation</h3>
                  <p className="text-xs text-slate-500">Add directly into active investigations list</p>
                </div>
              </div>

              <form onSubmit={handleStartQuickInvestigation} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Investigation Name *</label>
                  <input
                    type="text"
                    required
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="e.g. Operation DarkSun Triage"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Type</label>
                    <select
                      value={quickType}
                      onChange={(e) => setQuickType(e.target.value as Investigation['type'])}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-slate-50 capitalize"
                    >
                      <option value="ransomware">Ransomware</option>
                      <option value="data-breach">Data Breach</option>
                      <option value="insider-threat">Insider Threat</option>
                      <option value="malware">Malware</option>
                      <option value="network-intrusion">Network Intrusion</option>
                      <option value="phishing">Phishing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
                    <select
                      value={quickPriority}
                      onChange={(e) => setQuickPriority(e.target.value as Investigation['priority'])}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-slate-50 capitalize"
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsQuickModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Start Investigation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {investigationToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 card-shadow border border-slate-100 relative"
            >
              <button
                onClick={() => setInvestigationToDelete(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">Confirm Deletion</h3>
              <p className="text-xs text-slate-600 mb-4">
                Are you sure you want to delete the investigation{' '}
                <span className="font-semibold text-slate-900">{investigationToDelete.name}</span> (
                <span className="font-mono text-slate-700">{investigationToDelete.caseId}</span>)? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setInvestigationToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Investigation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
