import { create } from "zustand";
import axios from "axios";

const API_BASE = "http://localhost:8080";

interface MobileStore {
  incidents: any[];
  selectedIncident: any | null;
  timeline: any[];

  setIncidents: (incidents: any[]) => void;
  setSelectedIncident: (incident: any) => void;
  fetchIncidents: () => Promise<any[]>;
  fetchIncidentTimeline: (id: string) => Promise<any[]>;
  createIncident: (title: string, type: string, severity: string) => Promise<any>;
  triggerReconstruction: (id: string) => Promise<void>;
  voiceQuery: (audioBase64: string, languageCode: string) => Promise<any>;
}

export const useMobileStore = create<MobileStore>((set) => ({
  incidents: [],
  selectedIncident: null,
  timeline: [],

  setIncidents: (incidents) =>
    set({ incidents }),

  setSelectedIncident: (incident) =>
    set({ selectedIncident: incident }),

  fetchIncidents: async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/incidents`);
      set({ incidents: response.data });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
      throw error;
    }
  },

  fetchIncidentTimeline: async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/api/incidents/${id}/timeline`);
      set({ timeline: response.data });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch incident timeline for ${id}:`, error);
      throw error;
    }
  },

  createIncident: async (title, type, severity) => {
    try {
      const response = await axios.post(`${API_BASE}/api/incidents`, {
        title,
        type,
        severity,
        status: "OPEN",
        triggeredBy: "manual"
      });
      const updatedResponse = await axios.get(`${API_BASE}/api/incidents`);
      set({ incidents: updatedResponse.data });
      return response.data;
    } catch (error) {
      console.error("Failed to create incident:", error);
      throw error;
    }
  },

  triggerReconstruction: async (id) => {
    try {
      await axios.post(`${API_BASE}/api/incidents/${id}/reconstruct`);
    } catch (error) {
      console.error(`Failed to trigger reconstruction for ${id}:`, error);
      throw error;
    }
  },

  voiceQuery: async (audioBase64, languageCode) => {
    try {
      const response = await axios.post(`${API_BASE}/api/query/voice`, {
        audioBase64,
        languageCode,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to send voice query:", error);
      throw error;
    }
  },
}));