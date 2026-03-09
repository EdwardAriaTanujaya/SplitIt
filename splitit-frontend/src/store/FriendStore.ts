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
    pendingRequests: any[];
    loading: boolean;
    error: string | null;
    fetchFriends: (userId: string) => Promise<void>;
    sendRequest: (userId: string, friendId: string) => Promise<void>;
    respondToRequest: (requestId: string, status: "ACCEPTED" | "REJECTED") => Promise<void>;
}

const useFriendStore = create<FriendStore>((set) => ({
    friends: [],
    pendingRequests: [],
    loading: false,
    error: null,

    fetchFriends: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            // Need a get friends by user ID endpoint if not in controller.
            // Let's assume it exists or check it.
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/friends/pending/${userId}`, { withCredentials: true });
            set({ pendingRequests: response.data, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    sendRequest: async (userId: string, friendId: string) => {
        set({ loading: true, error: null });
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/friends/request`, {
                userId,
                friendId,
            }, { withCredentials: true });
            set({ loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    respondToRequest: async (requestId: string, status: "ACCEPTED" | "REJECTED") => {
        set({ loading: true, error: null });
        try {
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/friends/respond`, {
                requestId,
                status,
            }, { withCredentials: true });
            set({ loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },
}));

export default useFriendStore;
