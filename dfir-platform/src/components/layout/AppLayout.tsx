import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useStore } from '../../store';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

export default function AppLayout({ children, title, breadcrumbs }: AppLayoutProps) {
  const { sidebarCollapsed } = useStore();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 flex flex-col min-h-screen min-w-0"
      >
        <TopBar title={title} breadcrumbs={breadcrumbs} />
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6 overflow-auto"
        >
          {children}
        </motion.main>
      </motion.div>

      {/* Floating Help Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-12 h-12 gradient-blue rounded-full flex items-center justify-center text-white shadow-lg z-30"
        title="Help & Support"
      >
        <span className="text-lg font-bold">?</span>
      </motion.button>
    </div>
  );
}
