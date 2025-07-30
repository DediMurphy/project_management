import { create } from "zustand";
import {
    getAllProject,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from "../../services/projectServices";

export const useProjectStore = create((set) => ({
    projects: [],
    selectedProject: null,
    loading: false,
    error: null,

    fetchProjects: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getAllProject();
            set({ projects: data, loading: false });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memuat data project";
            set({ error: message, loading: false });
        }
    },

    fetchProjectById: async (id) => {
        set({ loading: true, error: null });
        try {
            const project = await getProjectById(id);
            set({ selectedProject: project, loading: false });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memuat detail project";
            set({ error: message, loading: false });
        }
    },

    addProject: async (data) => {
        set({ loading: true, error: null });
        try {
            const newProject = await createProject(data);
            set((state) => ({ projects: [...state.projects, newProject], loading: false }));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal menambahkan project";
            set({ error: message, loading: false });
        }
    },

    editProject: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updated = await updateProject(id, data);
            set((state) => ({
                projects: state.projects.map((p) =>
                    p.project_id === id ? { ...p, ...updated } : p
                ),
                loading: false,
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memperbarui project";
            set({ error: message, loading: false });
        }
    },

    removeProject: async (id) => {
        set({ loading: true, error: null });
        try {
            await deleteProject(id);
            set((state) => ({
                projects: state.projects.filter((p) => p.project_id !== id),
                loading: false,
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal menghapus project";
            set({ error: message, loading: false });
        }
    },
}));
