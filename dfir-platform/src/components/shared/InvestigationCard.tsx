import { motion } from 'framer-motion';
import type { Investigation } from '../../types';
import { Shield, Clock, ChevronRight, Activity, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

const priorityConfig = {
  critical: { label: 'CRITICAL', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
  high: { label: 'HIGH', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  medium: { label: 'MEDIUM', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  low: { label: 'LOW', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
};

const statusConfig = {
  planning: { label: 'Planning', color: 'text-slate-500', bg: 'bg-slate-100' },
  collecting: { label: 'Collecting', color: 'text-blue-600', bg: 'bg-blue-100' },
  processing: { label: 'Processing', color: 'text-violet-600', bg: 'bg-violet-100' },
  analyzing: { label: 'Analyzing', color: 'text-cyan-700', bg: 'bg-cyan-100' },
  reporting: { label: 'Reporting', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  complete: { label: 'Complete', color: 'text-green-700', bg: 'bg-green-100' },
  archived: { label: 'Archived', color: 'text-slate-500', bg: 'bg-slate-100' },
};

interface Props {
  investigation: Investigation;
  compact?: boolean;
  onDelete?: (e: React.MouseEvent, inv: Investigation) => void;
}

export default function InvestigationCard({ investigation: inv, compact, onDelete }: Props) {
  const navigate = useNavigate();
  const { setActiveInvestigation } = useStore();
  const p = priorityConfig[inv.priority];
  const s = statusConfig[inv.status];

  return (
    <motion.div
      whileHover={{ y: -1, boxShadow: '0 8px 25px rgba(0,0,0,0.09)' }}
      onClick={() => { setActiveInvestigation(inv); navigate('/workspace'); }}
      className="bg-white rounded-2xl p-4 border border-slate-100 card-shadow cursor-pointer transition-all duration-200 relative group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.bg} ${p.text} ${p.border} flex items-center gap-1`}>
              <span className={`w-1 h-1 rounded-full ${p.dot}`} />
              {p.label}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>{s.label}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900 truncate">{inv.name}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{inv.caseId}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 mt-1">
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(e, inv);
              }}
              title="Delete Investigation"
              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>
      </div>

      {!compact && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{inv.description}</p>
      )}

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-500">Investigation Progress</span>
          <span className="text-[10px] font-semibold text-slate-700">{inv.progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${inv.progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: inv.priority === 'critical' ? 'linear-gradient(90deg,#ef4444,#f97316)' : 'linear-gradient(90deg,#3b82f6,#6366f1)' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-600" />{inv.trustScore}% trust</span>
        <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" />
          {new Date(inv.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}
