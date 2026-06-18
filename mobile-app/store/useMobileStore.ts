import { create } from "zustand";

interface MobileStore {
  incidents: any[];
  selectedIncident: any | null;

  setIncidents: (incidents: any[]) => void;
  setSelectedIncident: (incident: any) => void;
}

export const useMobileStore = create<MobileStore>((set) => ({
  incidents: [],
  selectedIncident: null,

  setIncidents: (incidents) =>
    set({ incidents }),

  setSelectedIncident: (incident) =>
    set({ selectedIncident: incident }),
}));