import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewInvestigation from './pages/NewInvestigation';
import Workspace from './pages/Workspace';
import EvidenceIntelligence from './pages/EvidenceIntelligence';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { ToastContainer } from './components/shared/Toast';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <HashRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/new-investigation" element={<PrivateRoute><NewInvestigation /></PrivateRoute>} />
        <Route path="/workspace" element={<PrivateRoute><Workspace /></PrivateRoute>} />
        <Route path="/evidence" element={<PrivateRoute><EvidenceIntelligence /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
