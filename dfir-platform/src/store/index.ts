import { create } from 'zustand';
import type { User, Investigation, Evidence, Agent, Notification, TimelineEvent } from '../types';
import { mockInvestigations, mockEvidence, mockAgents, mockNotifications, mockTimeline } from '../data/mockData';

const LOCAL_STORAGE_KEY_CASES = 'dfir_investigations_v2';
const LOCAL_STORAGE_KEY_EVIDENCE = 'dfir_evidence_v2';

const getInitialInvestigations = (): Investigation[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_CASES);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored investigations:', e);
  }
  return mockInvestigations;
};

const getInitialEvidence = (): Evidence[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_EVIDENCE);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored evidence:', e);
  }
  return mockEvidence;
};

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Investigations
  investigations: Investigation[];
  activeInvestigation: Investigation | null;
  setActiveInvestigation: (inv: Investigation | null) => void;
  fetchInvestigationsFromBackend: () => Promise<void>;
  addInvestigation: (inv: Investigation) => Promise<void>;
  updateInvestigation: (id: string, updates: Partial<Investigation>) => void;
  deleteInvestigation: (id: string) => void;

  // Evidence
  evidence: Evidence[];
  addEvidence: (ev: Evidence) => Promise<void>;
  updateEvidence: (id: string, updates: Partial<Evidence>) => void;

  // Agents
  agents: Agent[];
  updateAgent: (id: string, updates: Partial<Agent>) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;

  // Timeline
  timelineEvents: TimelineEvent[];

  // UI State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  globalSearchQuery: string;
  setGlobalSearch: (q: string) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const initialCases = getInitialInvestigations();
const initialEv = getInitialEvidence();

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, isAuthenticated: true });
        return true;
      }
    } catch (e) {
      console.warn('Django backend auth check offline, using default user');
    }
    await new Promise(r => setTimeout(r, 600));
    const user: User = {
      id: 'usr-001',
      name: 'Dr. Sarah Mitchell',
      email,
      role: 'admin',
      mfaEnabled: true,
    };
    set({ user, isAuthenticated: true });
    return true;
  },
  logout: () => set({ user: null, isAuthenticated: false }),

  // Investigations
  investigations: initialCases,
  activeInvestigation: initialCases[0] || null,
  setActiveInvestigation: (inv) => set({ activeInvestigation: inv }),

  fetchInvestigationsFromBackend: async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/cases/');
      if (res.ok) {
        const data = await res.json();
        const casesList: Investigation[] = Array.isArray(data) ? data : data.results || [];
        if (casesList.length > 0) {
          set({ investigations: casesList, activeInvestigation: casesList[0] });
          localStorage.setItem(LOCAL_STORAGE_KEY_CASES, JSON.stringify(casesList));
        }
      }
    } catch (e) {
      console.warn('Backend fetch fallback to cached/localStorage cases');
    }
  },

  addInvestigation: async (inv) => {
    // 1. Update in-memory state & localStorage immediately
    set((s) => {
      const updated = [inv, ...s.investigations];
      localStorage.setItem(LOCAL_STORAGE_KEY_CASES, JSON.stringify(updated));
      return { investigations: updated, activeInvestigation: inv };
    });

    // 2. Persist directly to local MySQL database via Django REST API
    try {
      await fetch('http://localhost:8000/api/v1/cases/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: inv.id,
          name: inv.name,
          caseId: inv.caseId,
          priority: inv.priority,
          type: inv.type,
          status: inv.status,
          description: inv.description,
          prompt: inv.prompt,
          assignedTo: inv.assignedTo,
          trustScore: inv.trustScore,
          confidence: inv.confidence,
          progress: inv.progress,
          evidenceCount: inv.evidenceCount,
          agentsActive: 0,
        }),
      });
    } catch (e) {
      console.warn('Could not post case to backend, saved to localStorage');
    }
  },

  updateInvestigation: (id, updates) => set((s) => {
    const updated = s.investigations.map(i => i.id === id ? { ...i, ...updates } : i);
    localStorage.setItem(LOCAL_STORAGE_KEY_CASES, JSON.stringify(updated));
    return {
      investigations: updated,
      activeInvestigation: s.activeInvestigation?.id === id ? { ...s.activeInvestigation, ...updates } : s.activeInvestigation,
    };
  }),

  deleteInvestigation: (id) => set((s) => {
    const updated = s.investigations.filter(i => i.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_CASES, JSON.stringify(updated));
    
    // Also trigger backend delete asynchronously
    fetch(`http://localhost:8000/api/v1/cases/${id}/`, { method: 'DELETE' }).catch(() => {});

    return {
      investigations: updated,
      activeInvestigation: s.activeInvestigation?.id === id ? (updated[0] || null) : s.activeInvestigation,
    };
  }),

  // Evidence
  evidence: initialEv,
  addEvidence: async (ev) => {
    set((s) => {
      const updated = [ev, ...s.evidence];
      localStorage.setItem(LOCAL_STORAGE_KEY_EVIDENCE, JSON.stringify(updated));
      return { evidence: updated };
    });

    try {
      await fetch('http://localhost:8000/api/v1/evidence/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ev.id,
          name: ev.name,
          type: ev.type,
          size: ev.size,
          hash_md5: ev.hash.md5,
          hash_sha256: ev.hash.sha256,
          hash_sha512: ev.hash.sha512,
          collected_by: ev.collectedBy,
          trust_score: ev.trustScore,
          status: ev.status,
          investigation_id: ev.investigationId,
          tags: ev.tags,
        }),
      });
    } catch (e) {
      console.warn('Could not post evidence to backend, saved to localStorage');
    }
  },

  updateEvidence: (id, updates) => set((s) => {
    const updated = s.evidence.map(e => e.id === id ? { ...e, ...updates } : e);
    localStorage.setItem(LOCAL_STORAGE_KEY_EVIDENCE, JSON.stringify(updated));
    return { evidence: updated };
  }),

  // Agents
  agents: mockAgents,
  updateAgent: (id, updates) => set((s) => ({
    agents: s.agents.map(a => a.id === id ? { ...a, ...updates } : a),
  })),

  // Notifications
  notifications: mockNotifications,
  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  })),
  markAllRead: () => set((s) => ({
    notifications: s.notifications.map(n => ({ ...n, read: true })),
  })),

  // Timeline
  timelineEvents: mockTimeline,

  // UI State
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  globalSearchQuery: '',
  setGlobalSearch: (q) => set({ globalSearchQuery: q }),
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),
}));
