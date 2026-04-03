import axios from "axios";
import { create } from "zustand";

interface Group {
    id: string;
    name: string;
    groupImage?: string;
    members: Array<{ user: { name: string } }>;
}

interface GroupStore {
    groups: Group[];
    loading: boolean;
    error: string | null;
    fetchGroups: (userId: string) => Promise<void>;
    createGroup: (name: string, memberIds: string[], creatorId: string, groupImage?: string) => Promise<void>;
    leaveGroup: (groupId: string, userId: string) => Promise<void>;
}

const useGroupStore = create<GroupStore>((set) => ({
    groups: [],
    loading: false,
    error: null,

    fetchGroups: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/groups/user/${userId}`, { withCredentials: true });
            set({ groups: response.data, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    createGroup: async (name: string, memberIds: string[], creatorId: string, groupImage?: string) => {
        set({ loading: true, error: null });
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/groups`, {
                name,
                memberIds,
                creatorId,
                groupImage,
            }, { withCredentials: true });
            set({ loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },
    leaveGroup: async (groupId: string, userId: string) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}/user/${userId}`, { withCredentials: true });
            set({ loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },
}));

export default useGroupStore;
