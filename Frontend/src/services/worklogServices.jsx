import API from "../utils/api";

export const getAllWorklogs = async () => {
    try {
        const res = await API.get("/api/v1/workingHistory");
        return res.data.data;
    } catch (error) {
        console.error("Gagal mengambil semua worklog:", error);
        throw error;
    }
};

export const getWorklogByDate = async (date) => {
    try {
        const res = await API.get(`/api/v1/workingHistory?date=${date}`);
        return res.data.data;
    } catch (error) {
        console.error(`Gagal mengambil worklog berdasarkan tanggal ${date}:`, error);
        throw error;
    }
};

export const getWorklogById = async (id) => {
    try {
        const res = await API.get(`/api/v1/workingHistory/${id}`);
        return res.data.data;
    } catch (error) {
        console.error(`Gagal mengambil worklog dengan ID ${id}:`, error);
        throw error;
    }
};

export const createWorklog = async (data) => {
    try {
        const res = await API.post("/api/v1/workingHistory", data);
        return res.data.data;
    } catch (error) {
        console.error("Gagal membuat worklog:", error);
        throw error;
    }
};

export const updateWorklog = async (id, data) => {
    try {
        const res = await API.put(`/api/v1/workingHistory/${id}`, data);
        return res.data.data;
    } catch (error) {
        console.error(`Gagal mengupdate worklog dengan ID ${id}:`, error);
        throw error;
    }
};

export const deleteWorklog = async (id) => {
    try {
        const res = await API.delete(`/api/v1/workingHistory/${id}`);
        return res.data.data;
    } catch (error) {
        console.error(`Gagal menghapus worklog dengan ID ${id}:`, error);
        throw error;
    }
};
