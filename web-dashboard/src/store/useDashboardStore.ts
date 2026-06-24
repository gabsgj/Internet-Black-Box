import { create } from 'zustand';
import type { Incident, EventNode, IncidentGraph, DashboardMetrics, IncidentType } from '../types';
import { mockIncidents, mockEvents, getMockGraph, mockReconstructionReport, mockMetrics } from '../mockData';

export interface UserSession {
  name: string;
  email: string;
}

export interface UserAccount extends UserSession {
  password: string;
}

interface DashboardState {
  // Incident Data
  incidents: Incident[];
  activeIncident: Incident | null;
  activeTimeline: EventNode[];
  activeGraph: IncidentGraph;
  metrics: DashboardMetrics;
  isLoading: boolean;
  isReconstructing: boolean;
  websocketStatus: 'connected' | 'disconnected';
  realTimeMode: boolean; // false = mock mode, true = live API mode
  
  // Auth State
  currentUser: UserSession | null;
  registeredUsers: UserAccount[];

  // Actions
  setRealTimeMode: (mode: boolean) => void;
  fetchIncidents: () => Promise<void>;
  fetchIncidentDetails: (id: string) => Promise<void>;
  triggerReconstruction: (id: string) => Promise<void>;
  createIncidentManually: (title: string, severity: 'P1' | 'P2' | 'P3', type: string) => Promise<void>;
  
  // Auth Actions
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;

  // WebSocket
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
}

let wsClient: WebSocket | null = null;

// Default seeded users list if none exists in localStorage
const defaultUsers: UserAccount[] = [
  { name: 'Sarah Jenkins', email: 'sarah@company.com', password: 'password123' },
  { name: 'Rahul Sharma', email: 'rahul@company.com', password: 'password123' },
];

const loadInitialUsers = (): UserAccount[] => {
  try {
    const list = localStorage.getItem('bb_users');
    if (list) return JSON.parse(list);
    localStorage.setItem('bb_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  } catch {
    return defaultUsers;
  }
};

const loadInitialSession = (): UserSession | null => {
  try {
    const session = localStorage.getItem('bb_session');
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  incidents: mockIncidents,
  activeIncident: null,
  activeTimeline: [],
  activeGraph: { nodes: [], edges: [] },
  metrics: mockMetrics,
  isLoading: false,
  isReconstructing: false,
  websocketStatus: 'disconnected',
  realTimeMode: false,
  
  // Auth State
  currentUser: loadInitialSession(),
  registeredUsers: loadInitialUsers(),

  setRealTimeMode: (mode) => {
    set({ realTimeMode: mode });
    get().fetchIncidents();
  },

  fetchIncidents: async () => {
    set({ isLoading: true });
    const { realTimeMode } = get();

    if (realTimeMode) {
      try {
        const res = await fetch('http://localhost:8080/api/incidents');
        if (res.ok) {
          const data = await res.json();
          set({ incidents: data });
        }
      } catch (err) {
        console.error('Failed to fetch live incidents, staying in mock mode:', err);
      } finally {
        set({ isLoading: false });
      }
    } else {
      set({ incidents: mockIncidents, isLoading: false });
    }
  },

  fetchIncidentDetails: async (id) => {
    set({ isLoading: true });
    const { realTimeMode } = get();

    if (realTimeMode) {
      try {
        const detailsRes = await fetch(`http://localhost:8080/api/incidents/${id}`);
        const timelineRes = await fetch(`http://localhost:8080/api/incidents/${id}/timeline`);
        const graphRes = await fetch(`http://localhost:8080/api/incidents/${id}/graph`);

        const activeIncident = detailsRes.ok ? await detailsRes.json() : null;
        const activeTimeline = timelineRes.ok ? await timelineRes.json() : [];
        const activeGraph = graphRes.ok ? await graphRes.json() : { nodes: [], edges: [] };

        set({ activeIncident, activeTimeline, activeGraph });
      } catch (err) {
        console.error('Failed to fetch live incident details:', err);
      } finally {
        set({ isLoading: false });
      }
    } else {
      const incident = get().incidents.find((i) => i.id === id) || null;
      const timeline = id === 'inc-payment-500' ? [...mockEvents] : [];
      const graph = getMockGraph(id);

      if (incident && incident.id === 'inc-payment-500' && incident.status === 'RESOLVED') {
        incident.aiSummary = mockReconstructionReport.aiSummary;
        incident.rootCause = mockReconstructionReport.rootCause;
      }

      set({
        activeIncident: incident,
        activeTimeline: timeline,
        activeGraph: graph,
        isLoading: false,
      });
    }
  },

  triggerReconstruction: async (id) => {
    set({ isReconstructing: true });
    const { realTimeMode } = get();

    if (realTimeMode) {
      try {
        const res = await fetch(`http://localhost:8080/api/incidents/${id}/reconstruct`, {
          method: 'POST',
        });
        if (res.ok) {
          await get().fetchIncidentDetails(id);
        }
      } catch (err) {
        console.error('Failed to trigger live reconstruction:', err);
      } finally {
        set({ isReconstructing: false });
      }
    } else {
      set({
        incidents: get().incidents.map((inc) =>
          inc.id === id ? { ...inc, status: 'RECONSTRUCTING' } : inc
        ),
        activeIncident: get().activeIncident?.id === id 
          ? { ...get().activeIncident!, status: 'RECONSTRUCTING' }
          : get().activeIncident
      });

      await new Promise((resolve) => setTimeout(resolve, 2500));

      const updatedIncidents = get().incidents.map((inc) => {
        if (inc.id === id) {
          return {
            ...inc,
            status: 'RESOLVED' as const,
            aiSummary: mockReconstructionReport.aiSummary,
            rootCause: mockReconstructionReport.rootCause,
          };
        }
        return inc;
      });

      const updatedActive = get().activeIncident?.id === id
        ? {
            ...get().activeIncident!,
            status: 'RESOLVED' as const,
            aiSummary: mockReconstructionReport.aiSummary,
            rootCause: mockReconstructionReport.rootCause,
          }
        : get().activeIncident;

      set({
        incidents: updatedIncidents,
        activeIncident: updatedActive,
        isReconstructing: false,
        metrics: {
          ...get().metrics,
          openIncidentsCount: Math.max(0, get().metrics.openIncidentsCount - 1),
          systemStatuses: {
            ...get().metrics.systemStatuses,
            sentry: 'online',
          }
        }
      });
    }
  },

  createIncidentManually: async (title, severity, type) => {
    const { realTimeMode } = get();

    const newIncident: Incident = {
      id: `inc-${Date.now().toString().slice(-4)}`,
      title,
      type: type as IncidentType,
      triggeredAt: new Date().toISOString(),
      triggeredBy: 'Manual Trigger (Dashboard)',
      status: 'OPEN',
      severity,
      aiSummary: '',
      rootCause: '',
    };

    if (realTimeMode) {
      try {
        const res = await fetch('http://localhost:8080/api/incidents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newIncident),
        });
        if (res.ok) {
          get().fetchIncidents();
        }
      } catch (err) {
        console.error('Failed to create live incident:', err);
      }
    } else {
      set({
        incidents: [newIncident, ...get().incidents],
        metrics: {
          ...get().metrics,
          openIncidentsCount: get().metrics.openIncidentsCount + 1,
        }
      });
    }
  },

  // Auth Operations
  loginUser: async (email, password) => {
    const users = get().registeredUsers;
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (matchedUser) {
      const session: UserSession = { name: matchedUser.name, email: matchedUser.email };
      localStorage.setItem('bb_session', JSON.stringify(session));
      set({ currentUser: session });
      return true;
    }
    return false;
  },

  registerUser: async (name, email, password) => {
    const users = get().registeredUsers;
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return false;
    }

    const newUser: UserAccount = { name, email, password };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('bb_users', JSON.stringify(updatedUsers));
    
    const session: UserSession = { name, email };
    localStorage.setItem('bb_session', JSON.stringify(session));
    
    set({ 
      registeredUsers: updatedUsers,
      currentUser: session
    });
    return true;
  },

  logoutUser: async () => {
    localStorage.removeItem('bb_session');
    set({ currentUser: null });
  },

  connectWebSocket: () => {
    const { realTimeMode } = get();
    if (!realTimeMode) {
      set({ websocketStatus: 'connected' });
      return;
    }

    if (wsClient) {
      wsClient.close();
    }

    try {
      wsClient = new WebSocket('ws://localhost:8080/ws/events');
      
      wsClient.onopen = () => {
        set({ websocketStatus: 'connected' });
        console.log('Dashboard WebSocket Connected');
      };

      wsClient.onclose = () => {
        set({ websocketStatus: 'disconnected' });
        console.log('Dashboard WebSocket Disconnected');
        setTimeout(() => get().connectWebSocket(), 5000);
      };

      wsClient.onerror = (err) => {
        console.error('WebSocket Error:', err);
      };

      wsClient.onmessage = (messageEvent) => {
        try {
          const parsed = JSON.parse(messageEvent.data);
          if (parsed.type === 'NEW_EVENT' && parsed.event) {
            set((state) => ({
              activeTimeline: [parsed.event, ...state.activeTimeline],
              metrics: {
                ...state.metrics,
                totalEventsCount: state.metrics.totalEventsCount + 1,
              }
            }));
          } else if (parsed.type === 'INCIDENT_UPDATE' && parsed.incident) {
            set((state) => ({
              incidents: state.incidents.map((i) => 
                i.id === parsed.incident.id ? parsed.incident : i
              ),
              activeIncident: state.activeIncident?.id === parsed.incident.id 
                ? parsed.incident 
                : state.activeIncident
            }));
          }
        } catch (err) {
          console.error('Error processing web socket message:', err);
        }
      };
    } catch (err) {
      console.error('WebSocket creation error:', err);
      set({ websocketStatus: 'disconnected' });
    }
  },

  disconnectWebSocket: () => {
    if (wsClient) {
      wsClient.close();
      wsClient = null;
    }
    set({ websocketStatus: 'disconnected' });
  },
}));
