import { useEffect } from "react";
import { toYMDDate } from "../../../../utils/dateFormatter";
import { useAuthStore } from "../../../../store/auth/useAuthStore.js";
import { isGetByUsername } from "../../../../utils/permissionUser.js";
import {useLeaveStore} from "../../../../store/attendance/useLeaveStore.js";

export default function MiniApprovalPanel() {
    const {leaveRequests,fetchPendingLeaves, approveLeaveRequest, rejectLeaveRequest, loading} = useLeaveStore();

    const { user } = useAuthStore();

    useEffect(() => {
        fetchPendingLeaves();
    }, [fetchPendingLeaves]);

    const pendingLeaves = Array.isArray(leaveRequests)
        ? leaveRequests.filter((l) => l.status === "Pending").slice(0, 3)
        : [];

    const isPrivileged = isGetByUsername(user?.username);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Approval Tertunda</h3>
            {loading ? (
                <p className="text-sm text-gray-500 text-center">Memuat data...</p>
            ) : pendingLeaves.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">Tidak ada pengajuan cuti.</p>
            ) : (
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                    {pendingLeaves.map((leave) => (
                        <li key={leave.leave_id} className="border-b pb-2">
                            <p>
                                <span className="font-semibold">{leave.user?.username}</span> – {leave.type}
                            </p>
                            <p className="text-xs text-gray-500">
                                {toYMDDate(leave.startDate)} s.d {toYMDDate(leave.endDate)}
                            </p>
                            {isPrivileged && (
                                <div className="mt-2 flex gap-2">
                                    <button
                                        onClick={() => approveLeaveRequest(leave.leave_id)}
                                        className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => rejectLeaveRequest(leave.leave_id)}
                                        className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
