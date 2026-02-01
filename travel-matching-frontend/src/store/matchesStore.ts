import { create } from "zustand";
import { apiService } from "../services/api";

interface MatchesState {
  // State
  matchRequests: any[];
  confirmedMatches: any[];
  searchResults: any[];
  isLoadingRequests: boolean;
  isLoadingConfirmed: boolean;
  isLoadingSearch: boolean;
  requestsError: string | null;
  confirmedError: string | null;
  searchError: string | null;

  // Actions
  fetchMatchRequests: () => Promise<void>;
  fetchConfirmedMatches: () => Promise<void>;
  findMatches: (searchData: any) => Promise<void>;
  sendMatchRequest: (receiverId: string) => Promise<void>;
  respondToRequest: (requestId: string, action: "ACCEPT" | "REJECT") => Promise<void>;
  clearMatches: () => void;
}

export const useMatchesStore = create<MatchesState>((set, get) => ({
  // Initial State
  matchRequests: [],
  confirmedMatches: [],
  searchResults: [],
  isLoadingRequests: false,
  isLoadingConfirmed: false,
  isLoadingSearch: false,
  requestsError: null,
  confirmedError: null,
  searchError: null,

  // Fetch match requests
  fetchMatchRequests: async () => {
    set({ isLoadingRequests: true, requestsError: null });

    try {
      const requests = await apiService.getMatchRequests() as any[];
      set({ matchRequests: requests, isLoadingRequests: false });
    } catch (error: any) {
      set({ 
        requestsError: error.message || "Failed to fetch match requests", 
        isLoadingRequests: false 
      });
      console.error("Error fetching match requests:", error);
    }
  },

  // Fetch confirmed matches
  fetchConfirmedMatches: async () => {
    set({ isLoadingConfirmed: true, confirmedError: null });

    try {
      const matches = await apiService.getConfirmedMatches() as any[];
      set({ confirmedMatches: matches, isLoadingConfirmed: false });
    } catch (error: any) {
      set({ 
        confirmedError: error.message || "Failed to fetch confirmed matches", 
        isLoadingConfirmed: false 
      });
      console.error("Error fetching confirmed matches:", error);
    }
  },

  // Find matches based on search criteria
  findMatches: async (searchData) => {
    set({ isLoadingSearch: true, searchError: null });

    try {
      const results = await apiService.findMatches(searchData) as any[];
      set({ searchResults: results, isLoadingSearch: false });
    } catch (error: any) {
      set({ 
        searchError: error.message || "Failed to find matches", 
        isLoadingSearch: false 
      });
      console.error("Error finding matches:", error);
      throw error;
    }
  },

  // Send match request
  sendMatchRequest: async (receiverId) => {
    try {
      await apiService.sendMatchRequest(receiverId);
    } catch (error: any) {
      console.error("Error sending match request:", error);
      throw error;
    }
  },

  // Respond to match request
  respondToRequest: async (requestId, action) => {
    try {
      await apiService.respondToMatchRequest({ requestId, action });
      
      // Remove from requests list
      set((state) => ({
        matchRequests: state.matchRequests.filter(req => req.requestId !== requestId)
      }));

      // If accepted, refresh confirmed matches
      if (action === "ACCEPT") {
        get().fetchConfirmedMatches();
      }
    } catch (error: any) {
      console.error("Error responding to request:", error);
      throw error;
    }
  },

  // Clear matches state
  clearMatches: () => {
    set({
      matchRequests: [],
      confirmedMatches: [],
      searchResults: [],
      requestsError: null,
      confirmedError: null,
      searchError: null,
    });
  },
}));
