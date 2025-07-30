import { useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useAttendanceStore } from "../../../../store/attendance/useAttendanceStore.js";
import { useUserStore } from "../../../../store/user/useUserStore.js";
import  { isCountedUser } from "../../../../utils/permissionUser.js";

export default function AttendanceSummaryAdmin() {
    const { attendances, fetchAttendances } = useAttendanceStore();
    const { users, fetchUsers } = useUserStore();
    const filteredUsers = users.filter((u) => isCountedUser(u.role?.role_name));
    const userIdsToCount = filteredUsers.map((u) => u.user_id);
    const today = format(new Date(), "yyyy-MM-dd");

    useEffect(() => {
        const month = today.slice(0, 7);
        console.log("[useEffect] Fetching attendance for:", month);
        fetchAttendances(month);
        fetchUsers();
    }, []);

    console.log("Filtered Users (tanpa admin/hrd):", filteredUsers);
    console.log("userIdsToCount:", userIdsToCount);

    const summary = useMemo(() => {
        console.log("[useMemo] All attendances:", attendances);
        console.log("[useMemo] All users:", users);

        const todayData = attendances.filter(
            (a) => a.date.slice(0, 10) === today && userIdsToCount.includes(a.userId)
        );

        const checkedIn = todayData.filter((a) => a.checkIn !== null).length;
        const onLeave = todayData.filter(
            (a) => ["Leave", "Izin", "Cuti"].includes(a.status)
        ).length;

        const totalUsers = userIdsToCount.length;
        const notCheckedIn = totalUsers - checkedIn - onLeave;

        console.log("[useMemo] Summary →", {
            totalUsers,
            checkedIn,
            onLeave,
            notCheckedIn: Math.max(notCheckedIn, 0),
        });

        return {
            checkedIn,
            notCheckedIn: Math.max(notCheckedIn, 0),
            onLeave,
        };
    }, [attendances, userIdsToCount, today]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-100 text-green-800 font-semibold py-4 rounded-lg shadow text-center">
                <div className="text-xs">Check-in</div>
                <div className="text-2xl">{summary.checkedIn}</div>
            </div>
            <div className="bg-red-100 text-red-800 font-semibold py-4 rounded-lg shadow text-center">
                <div className="text-xs">Belum Check-in</div>
                <div className="text-2xl">{summary.notCheckedIn}</div>
            </div>
            <div className="bg-yellow-100 text-yellow-800 font-semibold py-4 rounded-lg shadow text-center">
                <div className="text-xs">Cuti / Izin</div>
                <div className="text-2xl">{summary.onLeave}</div>
            </div>
        </div>
    );
}
