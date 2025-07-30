import { useEffect } from "react";
import { useAuthStore } from "../../store/auth/useAuthStore";
import { useNavigate } from "react-router-dom";
import AttendanceSummaryAdmin from "../../components/dashboard/admin/summaries/AttendanceSummaryAdmin.jsx";
import {isGetByUsername} from "../../utils/permissionUser.js";
import RecentActivityFeed from "../../components/dashboard/admin/activities/RecentActivityFeed.jsx";
import {useActivityStore} from "../../store/activity/useActivityStore.js";
import MiniApprovalPanel from "../../components/dashboard/admin/panels/MiniApprovalPanel.jsx";
import MiniUserLeaveStatus from "../../components/dashboard/MiniUserLeaveStatus.jsx";
import AttendanceSummaryUser from "../../components/attendance/AttendanceSummaryUser.jsx";
import {useRecapStore} from "../../store/attendance/useRecapStore.js";


export default function DashboardPage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { activities, fetchActivities} = useActivityStore();
    const {recap, fetchRecap} = useRecapStore();

    useEffect(() => {
        if (!user) {
            navigate("/signin");
        } else {
            fetchActivities()
            const currentMonth = new Date().toISOString().slice(0, 7);
            if (user.user_id) {
                fetchRecap(user.user_id, currentMonth);
            }
        }
    }, [user, navigate, fetchActivities, fetchRecap])

    const isPrivileged = isGetByUsername(user?.username);

    return (
        <>
            <div>
                {isPrivileged ? (
                    <>
                        <div className="mb-6">
                            <AttendanceSummaryAdmin />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <RecentActivityFeed activities={activities} />
                            <MiniApprovalPanel />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-6">
                            <h1 className="text-center mb-6">Selamat Datang</h1>
                            {recap && <AttendanceSummaryUser recap={recap} />}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MiniUserLeaveStatus />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}


