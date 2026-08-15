import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Search, Activity, FileBarChart,
  Settings, Shield, ChevronLeft, ChevronRight, Zap,
  Database
} from 'lucide-react';
import { useStore } from '../../store';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/', badge: null },
  { id: 'new-investigation', label: 'New Investigation', icon: Search, path: '/new-investigation', badge: null },
  { id: 'workspace', label: 'Live Workspace', icon: Activity, path: '/workspace', badge: '●' },
  { id: 'evidence', label: 'Evidence Intelligence', icon: Database, path: '/evidence', badge: null },
  { id: 'reports', label: 'Reports & Verification', icon: FileBarChart, path: '/reports', badge: null },
  { id: 'settings', label: 'Settings & Audit', icon: Settings, path: '/settings', badge: null },
];

const quickStats = [
  { label: 'Active Cases', value: '4', color: 'text-blue-600' },
  { label: 'Trust Score', value: '94%', color: 'text-emerald-600' },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-40 flex flex-col overflow-hidden"
      style={{ boxShadow: '2px 0 20px rgba(0,0,0,0.06)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-100 min-h-[64px]">
        <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="text-sm font-bold text-gradient leading-tight">DFIR Platform</div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">AI Forensics</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.id}
              onClick={() => navigate(item.path)}
              whileHover={{ x: 2 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className={`w-5 h-5 flex-shrink-0 relative ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </div>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap flex-1"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1 bottom-1 w-1 bg-blue-600 rounded-r-full"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 border-t border-slate-100"
          >
            <div className="bg-slate-50 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Live Status</span>
              </div>
              {quickStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{stat.label}</span>
                  <span className={`text-xs font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
