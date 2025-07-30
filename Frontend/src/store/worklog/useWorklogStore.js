import { create } from "zustand";
import {
    getWorklogByDate,
    getAllWorklogs,
    createWorklog,
    updateWorklog,
    deleteWorklog,
} from "../../services/worklogServices";

export const useWorklogStore = create((set, get) => ({
    worklogs: [],
    loading: false,
    error: null,

    fetchLogsByDate: async (date) => {
        set({ loading: true, error: null });
        try {
            const data = await getWorklogByDate(date);
            set({ worklogs: data, loading: false });
        } catch (err) {
            set({
                error:
                    err instanceof Error ? err.message : "Gagal memuat data",
                loading: false,
            });
        }
    },

    fetchAllLogs: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getAllWorklogs();
            set({ worklogs: data, loading: false });
        } catch (err) {
            set({
                error:
                    err instanceof Error ? err.message : "Gagal memuat semua data",
                loading: false,
            });
        }
    },

    addLog: async (data, date) => {
        set({ loading: true, error: null });
        try {
            await createWorklog(data);
            await get().fetchLogsByDate(date);
        } catch (err) {
            set({
                error:
                    err instanceof Error ? err.message : "Gagal menambahkan catatan kerja",
            });
        } finally {
            set({ loading: false });
        }
    },

    editLog: async (id, data, date) => {
        set({ loading: true, error: null });
        try {
            await updateWorklog(id, data);
            await get().fetchLogsByDate(date);
        } catch (err) {
            set({
                error:
                    err instanceof Error ? err.message : "Gagal memperbarui catatan kerja",
            });
        } finally {
            set({ loading: false });
        }
    },

    removeLog: async (id, date) => {
        set({ loading: true, error: null });
        try {
            await deleteWorklog(id);
            await get().fetchLogsByDate(date);
        } catch (err) {
            set({
                error:
                    err instanceof Error ? err.message : "Gagal menghapus catatan kerja",
            });
        } finally {
            set({ loading: false });
        }
    },
}));
