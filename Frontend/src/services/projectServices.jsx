import API from "../utils/api";

export const getAllProject = async () => {
    try {
        const res = await API.get("/api/v1/projects");
        return res.data.data;
    } catch (error) {
        console.error("Gagal mengambil semua Project:", error);
        throw error;
    }
};

export const getProjectById = async (id) => {
    try {
        const res = await API.get(`/api/v1/projects/${id}`);
        return res.data.data;
    } catch (error) {
        console.error(`Gagal mengambil projects dengan ID ${id}:`, error);
        throw error;
    }
};

export const createProject = async (data) => {
    try {
        const res = await API.post("/api/v1/projects", data);
        return res.data.data;
    } catch (error) {
        console.error("Gagal membuat projects:", error);
        throw error;
    }
};

export const updateProject = async (id, data) => {
    try {
        const res = await API.put(`/api/v1/projects/${id}`, data);
        return res.data.data;
    } catch (error) {
        console.error(`Gagal mengupdate projects dengan ID ${id}:`, error);
        throw error;
    }
};

export const deleteProject = async (id) => {
    try {
        const res = await API.delete(`/api/v1/projects/${id}`);
        return res.data.data;
    } catch (error) {
        console.error(`Gagal menghapus projects dengan ID ${id}:`, error);
        throw error;
    }
};
