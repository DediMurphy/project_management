import API from "../utils/api";

export const getAllTasks = async () => {
    try {
        const res = await API.get("/api/v1/task");
        return res.data.data;
    } catch (error) {
        console.error("Gagal mengambil semua task:", error);
        throw error;
    }
};

export const getTasksByProjectId = async (projectId) => {
    try {
        const res = await API.get(`/api/v1/task?projectId=${projectId}`);
        return res.data.data;
    } catch (error) {
        console.error(`Gagal mengambil task`, error);
        throw error;
    }
};

export const getTaskById = async (id) => {
    try {
        const res = await API.get(`/api/v1/task/${id}`);
        return res.data.data;
    } catch (error) {
        console.error(`Gagal mengambil task dengan ID ${id}:`, error);
        throw error;
    }
};

export const createTask = async (data) => {
    try {
        const res = await API.post("/api/v1/task", data);
        return res.data.data;
    } catch (error) {
        console.error("Gagal membuat task:", error);
        throw error;
    }
};

export const updateTask = async (id, data) => {
    try {
        const res = await API.put(`/api/v1/task/${id}`, data);
        return res.data.data;
    } catch (error) {
        console.error(`Gagal mengupdate task dengan ID ${id}:`, error);
        throw error;
    }
};

export const deleteTask = async (id) => {
    try {
        const res = await API.delete(`/api/v1/task/${id}`);
        return res.data.data;
    } catch (error) {
        console.error(`Gagal menghapus task dengan ID ${id}:`, error);
        throw error;
    }
};
