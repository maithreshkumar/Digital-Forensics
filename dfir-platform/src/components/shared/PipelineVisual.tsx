import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader, AlertCircle, ArrowDown } from 'lucide-react';

interface Stage {
  label: string;
  status: 'complete' | 'running' | 'pending' | 'error';
  detail?: string;
}

interface PipelineVisualProps {
  stages: Stage[];
  compact?: boolean;
}

const statusConfig = {
  complete: { icon: CheckCircle, label: 'Completed', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', line: '#10b981', badge: 'bg-emerald-100 text-emerald-700' },
  running: { icon: Loader, label: 'Active', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', line: '#3b82f6', badge: 'bg-blue-100 text-blue-700' },
  pending: { icon: Circle, label: 'Pending', color: 'text-slate-300', bg: 'bg-slate-50', border: 'border-slate-200', line: '#e2e8f0', badge: 'bg-slate-100 text-slate-500' },
  error: { icon: AlertCircle, label: 'Error', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', line: '#ef4444', badge: 'bg-red-100 text-red-700' },
};

export default function PipelineVisual({ stages }: PipelineVisualProps) {
  return (
    <div className="flex flex-col gap-0 max-w-3xl mx-auto w-full py-1">
      {stages.map((stage, i) => {
        const { icon: Icon, label: statusLabel, color, bg, border, line, badge } = statusConfig[stage.status];
        return (
          <div key={i} className="flex flex-col items-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl border ${bg} ${border} w-full shadow-sm`}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/80 border border-slate-200 text-slate-600 font-bold text-xs flex-shrink-0">
                {i + 1}
              </div>

              <div className={`${color} flex-shrink-0`}>
                {stage.status === 'running' ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Icon className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-xs font-semibold text-slate-800 truncate">{stage.label}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badge} flex-shrink-0`}>
                    {statusLabel}
                  </span>
                </div>
                {stage.detail && <div className="text-[10px] text-slate-500 mt-0.5 truncate">{stage.detail}</div>}
              </div>

              {stage.status === 'running' && (
                <motion.div className="w-12 h-1.5 rounded-full bg-blue-200 overflow-hidden flex-shrink-0 hidden sm:block">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Connecting Line + Downward Arrow */}
            {i < stages.length - 1 && (
              <div className="flex flex-col items-center my-1">
                <motion.div
                  className="w-0.5 h-3 rounded-full"
                  style={{ background: line }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.04 + 0.02 }}
                />
                <ArrowDown className="w-3 h-3 text-slate-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
