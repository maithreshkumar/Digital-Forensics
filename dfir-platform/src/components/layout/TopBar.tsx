import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, ChevronDown, Settings, LogOut, HelpCircle, X, Check } from 'lucide-react';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

export default function TopBar({ title, breadcrumbs = [] }: TopBarProps) {
  const { user, notifications, markAllRead, markNotificationRead, logout, globalSearchQuery, setGlobalSearch } = useStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const notifColors = {
    error: 'bg-red-100 text-red-600',
    warning: 'bg-amber-100 text-amber-600',
    success: 'bg-emerald-100 text-emerald-600',
    info: 'bg-blue-100 text-blue-600',
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-30"
      style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}
    >
      {/* Title & Breadcrumbs */}
      <div className="flex-1 min-w-0">
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 mb-0.5">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-slate-300 text-xs">/</span>}
                <span className={`text-xs ${i === breadcrumbs.length - 1 ? 'text-slate-500' : 'text-blue-600 cursor-pointer hover:underline'}`}
                  onClick={() => b.path && navigate(b.path)}
                >{b.label}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="text-base font-semibold text-slate-900 truncate">{title}</h1>
      </div>

      {/* Global Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search investigations, evidence, reports..."
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl w-72 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Live Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">Platform Active</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
            className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-96 bg-white rounded-2xl border border-slate-200 card-shadow z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                    <p className="text-xs text-slate-500">{unreadCount} unread</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                    <button onClick={() => setShowNotifs(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {notifications.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 cursor-pointer hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}
                      onClick={() => markNotificationRead(n.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-lg ${notifColors[n.type]} flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5`}>
                          {n.type === 'error' ? '!' : n.type === 'warning' ? '⚠' : n.type === 'success' ? '✓' : 'i'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-xs font-semibold ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</p>
                            {!n.read && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'SM'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-[10px] text-blue-600 font-semibold uppercase">Admin</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-52 bg-white rounded-2xl border border-slate-200 card-shadow z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="p-2">
                  {[
                    { icon: User, label: 'Profile' },
                    { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
                    { icon: HelpCircle, label: 'Help & Support' },
                  ].map(({ icon: Icon, label, action }) => (
                    <button key={label} onClick={action} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                      <Icon className="w-4 h-4" /> {label}
                    </button>
                  ))}
                  <hr className="my-1 border-slate-100" />
                  <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
