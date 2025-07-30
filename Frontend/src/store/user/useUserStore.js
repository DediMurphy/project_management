import { create } from "zustand";
import { getAllUsers } from "../../services/userServices"; // sesuaikan path

export const useUserStore = create((set) => ({
    users: [],
    loading: false,
    error: null,

    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getAllUsers();
            set({ users: data, loading: false });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Gagal memuat data user",
                loading: false,
            });
        }
    },
}));
