import API from "../utils/api";

export const getAllAttendance = async (month, username) => {
    try {
        const params = { month }
        if (username) {
            params.username = username
        }
        const res = await API.get("/api/v1/attendance", {
            params: params,
        });
        return res.data.data;
    } catch (error) {
        console.error("Gagal mengambil data absensi:", error);
        throw error;
    }
};

export const checkInAttendance = async () => {
    try {
        const res = await API.post("/api/v1/attendance/check-in");
        return {
            message: res.data.message,
            data: res.data.data,
        };
    } catch (error) {
        console.error("Gagal melakukan check-in:", error);
        throw error;
    }
};

export const checkOutAttendance = async () => {
    try {
        const res = await API.post("/api/v1/attendance/check-out");
        return {
            message: res.data.message,
            data: res.data.data,
        };
    } catch (error) {
        console.error("Gagal melakukan check-out:", error);
        throw error;
    }
};

export const requestLeave = async (data) => {
    try {
        const res = await API.post("/api/v1/attendance/leave", data);
        return res.data.data;
    } catch (error) {
        console.error("Gagal mengajukan cuti/izin:", error);
        throw error;
    }
};


export const getAttendanceRecap = async (userId, month) => {
    try {
        const res = await API.get(`/api/v1/attendance/recap/${userId}`, {
            params: { month },
        });
        return res.data;
    } catch (error) {
        console.error("Gagal mengambil rekap absensi:", error);
        throw error;
    }
};

export const getAttendAll = async (month) => {
    try {
        const res = await API.get(`/api/v1/attendance/recap`, {
            params: {month},
        })
        return res.data
    } catch (error) {
        console.log("Gagal mengambil rekap absensi:", error);
        throw error;
        
    }
}


export const getAllLeaves = async () => {
    const res = await API.get("/api/v1/attendance/approval");
    return res.data.data;
};

export const approveLeave = async (id) => {
    await API.patch(`/api/v1/attendance/${id}/approve`, {
        status: "Approved",
    });
};

export const rejectLeave = async (id) => {
    await API.patch(`/api/v1/attendance/${id}/approve`, {
        status: "Rejected",
    });
};

export const getRecentActivities = async () => {
    try {
        const res = await API.get("/api/v1/attendance/recent-activities");
        return res.data.data;
    } catch (error) {
        console.error("Gagal mengambil recent activities:", error);
        throw error;
    }
};


