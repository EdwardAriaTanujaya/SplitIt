import axios from "axios";
import { create } from "zustand";

interface Friend {
    id: string;
    friendId: string;
    status: string;
    friend: {
        id: string;
        name: string;
        email: string;
    }
}

interface FriendStore {
    friends: Friend[];
    notifications: any[];
    pendingRequests: any[];
    acceptedFriends: Friend[];
    messages: any[];
    loading: boolean;
    error: string | null;
    fetchFriends: (userId: string) => Promise<void>;
    fetchNotifications: (userId: string) => Promise<void>;
    fetchConversation: (userId: string, friendId: string) => Promise<void>;
    sendMessage: (senderId: string, receiverId: string, content: string) => Promise<void>;
    sendRequest: (userId: string, friendId: string) => Promise<void>;
    respondToRequest: (userId: string, requestId: string, status: "ACCEPTED" | "DECLINED") => Promise<void>;
}

const useFriendStore = create<FriendStore>((set) => ({
    friends: [],
    notifications: [],
    pendingRequests: [],
    acceptedFriends: [],
    messages: [],
    loading: false,
    error: null,

    fetchFriends: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const [pendingResponse, acceptedResponse] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/friends/pending/${userId}`, { withCredentials: true }),
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/friends/accepted/${userId}`, { withCredentials: true }),
            ]);
            set({ pendingRequests: pendingResponse.data, acceptedFriends: acceptedResponse.data, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    fetchNotifications: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/friends/notifications/${userId}`, { withCredentials: true });
            set({ notifications: response.data, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    fetchConversation: async (userId: string, friendId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/messages/conversation/${userId}/${friendId}`, { withCredentials: true });
            set({ messages: response.data, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    sendMessage: async (senderId: string, receiverId: string, content: string) => {
        set({ loading: true, error: null });
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/messages/send`, {
                senderId,
                receiverId,
                content,
            }, { withCredentials: true });
            set({ loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    sendRequest: async (userId: string, friendId: string) => {
        set({ loading: true, error: null });
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/friends/request`, {
                requesterId: userId,
                friendEmailOrName: friendId,
            }, { withCredentials: true });
            set({ loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    respondToRequest: async (userId: string, requestId: string, status: "ACCEPTED" | "DECLINED") => {
        set({ loading: true, error: null });
        try {
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/friends/respond`, {
                userId,
                friendshipId: requestId,
                status,
            }, { withCredentials: true });
            set({ loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },
}));

export default useFriendStore;
