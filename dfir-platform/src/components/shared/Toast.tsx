import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'border-emerald-200 bg-white',
  error: 'border-red-200 bg-white',
  warning: 'border-amber-200 bg-white',
  info: 'border-blue-200 bg-white',
};

const iconStyles = {
  success: 'text-emerald-500 bg-emerald-50',
  error: 'text-red-500 bg-red-50',
  warning: 'text-amber-500 bg-amber-50',
  info: 'text-blue-500 bg-blue-50',
};

interface ToastProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

function Toast({ toast, onClose }: ToastProps) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const t = setTimeout(() => onClose(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex items-start gap-3 p-4 rounded-2xl border card-shadow w-80 ${styles[toast.type]}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconStyles[toast.type]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
        {toast.message && <p className="text-xs text-slate-500 mt-0.5">{toast.message}</p>}
      </div>
      <button onClick={() => onClose(toast.id)} className="text-slate-300 hover:text-slate-500 flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 rounded-full"
        style={{ background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : toast.type === 'warning' ? '#f59e0b' : '#3b82f6' }}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4, ease: 'linear' }}
      />
    </motion.div>
  );
}

let _addToast: ((t: Omit<ToastItem, 'id'>) => void) | null = null;
export const showToast = (t: Omit<ToastItem, 'id'>) => _addToast?.(t);

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  _addToast = (t) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...t, id }]);
  };

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto relative">
            <Toast toast={t} onClose={remove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
