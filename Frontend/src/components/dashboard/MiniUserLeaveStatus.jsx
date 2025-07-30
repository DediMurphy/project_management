import { useEffect } from "react";
import { useAuthStore } from "../../store/auth/useAuthStore";
import { toYMDDate } from "../../utils/dateFormatter";
import {useLeaveStore} from "../../store/attendance/useLeaveStore.js";

export default function MiniUserLeaveStatus() {
    const { leaveRequests, fetchPendingLeaves,loading } = useLeaveStore();
    const { user } = useAuthStore();

    useEffect(() => {
        fetchPendingLeaves();
    }, [fetchPendingLeaves]);

    const myLeaves = leaveRequests
        .filter((leave) => leave.user?.user_id === user?.user_id)
        .slice(0, 3);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Status Pengajuan Cuti</h3>
            {loading ? (
                <p className="text-sm text-gray-500 text-center">Memuat data...</p>
            ) : myLeaves.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">Belum ada pengajuan.</p>
            ) : (
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                    {myLeaves.map((leave) => (
                        <li key={leave.leave_id} className="border-b pb-2">
                            <p>
                                {leave.type} – <span className="text-xs">{leave.status}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                {toYMDDate(leave.startDate)} s.d {toYMDDate(leave.endDate)}
                            </p>
                            <p className="text-xs text-gray-400 italic">"{leave.reason}"</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
