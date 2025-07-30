import { create } from "zustand";
import {
    getAllTasks,
    getTasksByProjectId,
    createTask,
    updateTask,
    deleteTask,
} from "../../services/taskServices";

export const useTaskStore = create((set) => ({
    tasks: [],
    loading: false,
    error: null,

    fetchTasks: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getAllTasks();
            set({ tasks: data, loading: false });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Gagal memuat task",
                loading: false,
            });
        }
    },

    fetchTasksByProjectId: async (projectId) => {
        set({ loading: true, error: null });
        try {
            const data = await getTasksByProjectId(projectId);
            set({ tasks: data, loading: false });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Gagal memuat task berdasarkan project",
                loading: false,
            });
        }
    },

    addTask: async (data) => {
        set({ loading: true, error: null });
        try {
            const newTask = await createTask(data);
            set((state) => ({
                tasks: [...state.tasks, newTask],
                loading: false,
            }));
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Gagal menambahkan task",
                loading: false,
            });
        }
    },

    editTask: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedTask = await updateTask(id, data);
            set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.task_id === id ? { ...t, ...updatedTask } : t
                ),
                loading: false,
            }));
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Gagal mengupdate task",
                loading: false,
            });
        }
    },

    removeTask: async (id) => {
        set({ loading: true, error: null });
        try {
            await deleteTask(id);
            set((state) => ({
                tasks: state.tasks.filter((t) => t.task_id !== id),
                loading: false,
            }));
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Gagal menghapus task",
                loading: false,
            });
        }
    },
}));
