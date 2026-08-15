import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color: string;
  bgColor: string;
  trend?: { value: number; label: string };
  animated?: boolean;
  badge?: string;
  badgeColor?: string;
}

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <>{count}</>;
}

export default function StatCard({ title, value, subtitle, icon, color, bgColor, trend, animated, badge, badgeColor }: StatCardProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value as string);
  const isNumeric = !isNaN(numericValue) && animated;

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 -mr-8 -mt-8"
        style={{ background: color }}
      />

      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
          <div style={{ color }}>{icon}</div>
        </div>
        {badge && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor || 'bg-emerald-100 text-emerald-700'}`}>
            {badge}
          </span>
        )}
      </div>

      <div className="text-2xl font-bold text-slate-900 mb-0.5" style={{ color: color === 'inherit' ? undefined : undefined }}>
        {isNumeric ? <AnimatedCounter target={numericValue} /> : value}
        {typeof value === 'string' && value.includes('%') && !isNumeric && ''}
      </div>

      <div className="text-xs font-medium text-slate-500 mb-1">{title}</div>

      {subtitle && <div className="text-[11px] text-slate-400">{subtitle}</div>}

      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
          <span className="text-slate-400 font-normal">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}
