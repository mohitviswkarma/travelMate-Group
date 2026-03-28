/**
 * Centralized API Service
 * Handles all HTTP requests to the backend with consistent error handling
 */

//const API_BASE_URL = "http://localhost:8085/api";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8085";

class APIService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // ============ AUTH APIs ============
  async register(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async login(data: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async sendOTP(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return this.handleResponse(response);
  }

  async verifyOTP(data: { email: string; otp: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // ============ PROFILE APIs ============
  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/profile/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateProfile(data: any) {
    const response = await fetch(`${API_BASE_URL}/profile/update`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // ============ MATCHES APIs ============
  async findMatches(searchData: any) {
    const response = await fetch(`${API_BASE_URL}/matches/find`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(searchData),
    });
    return this.handleResponse(response);
  }

  async findGroups(searchData: any) {
    const response = await fetch(`${API_BASE_URL}/matches/find-groups`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(searchData),
    });
    return this.handleResponse(response);
  }

  // ============ GROUP APIs ============
  async sendGroupJoinRequest(groupId: string, message: string) {
    const response = await fetch(`${API_BASE_URL}/group/join-request`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ groupId, message }),
    });
    return this.handleResponse(response);
  }

  async sendMatchRequest(receiverId: string) {
    const response = await fetch(`${API_BASE_URL}/matches/send`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ receiverId }),
    });
    return this.handleResponse(response);
  }

  async getMatchRequests() {
    const response = await fetch(`${API_BASE_URL}/matches/requests`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getConfirmedMatches() {
    const response = await fetch(`${API_BASE_URL}/matches/confirmed`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async respondToMatchRequest(data: { requestId: string; action: "ACCEPT" | "REJECT" }) {
    const response = await fetch(`${API_BASE_URL}/matches/respond`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // ============ CHAT APIs ============
  async getConversations() {
    const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMessages(conversationId: string) {
    const response = await fetch(`${API_BASE_URL}/chat/messages/${conversationId}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async sendMessage(receiverId: string, content: string) {
    const response = await fetch(`${API_BASE_URL}/chat/send`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ receiverId, content }),
    });
    return this.handleResponse(response);
  }
}

// Export singleton instance
export const apiService = new APIService();
