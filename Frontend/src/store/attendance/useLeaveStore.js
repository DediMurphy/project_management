import { create } from "zustand";
import { requestLeave, approveLeave, rejectLeave, getAllLeaves } from "../../services/attendanceServices.jsx";

export const useLeaveStore = create((set) => ({
    leaveRequests: [],
    error: null,
    loading: false,

    fetchPendingLeaves: async () => {
        try {
            const data = await getAllLeaves();
            set({ leaveRequests: data });
        } catch {
            set({ error: "Gagal mengambil data cuti" });
        }
    },

    submitLeave: async (data) => {
        try {
            await requestLeave(data);
        } catch {
            set({ error: "Gagal mengajukan cuti" });
        }
    },

    approveLeaveRequest: async (id) => {
        try {
            await approveLeave(id);
            set((state) => ({
                leaveRequests: state.leaveRequests.map((r) =>
                    r.leave_id === id ? { ...r, status: "Approved" } : r
                ),
            }));
        } catch {
            set({ error: "Gagal menyetujui cuti" });
        }
    },

    rejectLeaveRequest: async (id) => {
        try {
            await rejectLeave(id);
            set((state) => ({
                leaveRequests: state.leaveRequests.map((r) =>
                    r.leave_id === id ? { ...r, status: "Rejected" } : r
                ),
            }));
        } catch {
            set({ error: "Gagal menolak cuti" });
        }
    },
}));
