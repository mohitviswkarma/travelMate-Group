import { create } from "zustand";
import { apiService } from "../services/api";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerPhoto?: string;
  lastMessage?: string;
  updatedAt: string;
  unreadCount: number;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>; // conversationId -> messages
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  
  // Actions
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  setActiveConversation: (id: string | null) => void;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  receiveMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  isLoadingConversations: false,
  isLoadingMessages: false,

  fetchConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const conversations = await apiService.getConversations() as Conversation[];
      set({ conversations, isLoadingConversations: false });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      set({ isLoadingConversations: false });
    }
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoadingMessages: true });
    try {
      const messages = await apiService.getMessages(conversationId) as Message[];
      set((state) => ({
        messages: { ...state.messages, [conversationId]: messages },
        isLoadingMessages: false,
      }) as Partial<ChatState>);
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ isLoadingMessages: false });
    }
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    if (id && !get().messages[id]) {
      get().fetchMessages(id);
    }
  },

  sendMessage: async (receiverId: string, content: string) => {
    try {
      const newMessage = await apiService.sendMessage(receiverId, content) as Message;
      
      // Update messages for current active conversation
      const conversationId = get().activeConversationId;
      if (conversationId) {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: [...(state.messages[conversationId] || []), newMessage],
          },
        }));
      }
      
      // Refresh conversations to update last message
      await get().fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  receiveMessage: (message: Message) => {
    // This would be called by a WebSocket listener
    const { conversations } = get();
    const conversationId = conversations.find(c => c.partnerId === message.senderId)?.id || message.senderId;

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    }));
    
    // Refresh list to update unread counts and last messages
    get().fetchConversations();
  },
}));
