import { create } from "zustand";
import { apiService } from "../services/api";

interface UserProfile {
  name: string;
  email: string;
  age?: number;
  gender?: string;
  hometown?: string;
  currentOccupation?: string;
  bio?: string;
  interests?: string[];
  budgetMin?: number;
  budgetMax?: number;
  travelLanguages?: string[];
  profilePhotoUrl?: string;
  preferredTravelCompanionGender?: string;
}

interface AuthState {
  // State
  token: string | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoadingProfile: boolean;
  profileError: string | null;

  // Actions
  setToken: (token: string | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial State
  token: localStorage.getItem("token"),
  userProfile: null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoadingProfile: false,
  profileError: null,

  // Set token
  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
      set({ token, isAuthenticated: true });
    } else {
      localStorage.removeItem("token");
      set({ token: null, isAuthenticated: false });
    }
  },

  // Set user profile
  setUserProfile: (profile) => {
    set({ userProfile: profile });
  },

  // Fetch user profile (cached)
  fetchUserProfile: async () => {
    const { userProfile, isLoadingProfile } = get();
    
    // Return cached profile if already loaded
    if (userProfile && !isLoadingProfile) {
      return;
    }

    set({ isLoadingProfile: true, profileError: null });

    try {
      const resp = await apiService.getProfile() as any;
      // Flatten name from nested user object if needed
      const profile: UserProfile = {
        ...resp,
        name: resp.name || resp.user?.name || ""
      };
      set({ userProfile: profile, isLoadingProfile: false });
    } catch (error: any) {
      set({ 
        profileError: error.message || "Failed to fetch profile", 
        isLoadingProfile: false 
      });
      console.error("Error fetching profile:", error);
    }
  },

  // Update user profile
  updateUserProfile: async (data) => {
    set({ isLoadingProfile: true, profileError: null });

    try {
      const resp = await apiService.updateProfile(data) as any;
      // Flatten name from nested user object if needed
      const updatedProfile: UserProfile = {
        ...resp,
        name: resp.name || resp.user?.name || ""
      };
      set({ userProfile: updatedProfile, isLoadingProfile: false });
    } catch (error: any) {
      set({ 
        profileError: error.message || "Failed to update profile", 
        isLoadingProfile: false 
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      set({ 
        token: null, 
        userProfile: null, 
        isAuthenticated: false,
        profileError: null 
      });
    }
  },

  // Clear auth state
  clearAuth: () => {
    localStorage.removeItem("token");
    set({ 
      token: null, 
      userProfile: null, 
      isAuthenticated: false,
      profileError: null 
    });
  },
}));
