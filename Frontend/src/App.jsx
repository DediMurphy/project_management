import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout.jsx";
import Dashboard from "./pages/dashboard/DashboardPage.jsx";
import SignInPage from "./pages/auth/SignInPage.jsx";
import { ScrollToTop } from "./components/common/ScrollToTop.jsx";
import ProjectPage from "./pages/project/ProjectPage.jsx";
import TaskPage from "./pages/tasks/TaskPage.jsx";
import Attendance from "./pages/attendance/Attendance.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AdminLeaveApproval from "./pages/admin/approvalManagement/AdminLeaveApproval.jsx";
import WorklogPage from "./pages/worklog/WorklogPage.jsx";
import WorkingHistoryPage from "./pages/worklog/WorkingHistoryPage.jsx";
import NotFound from "./pages/notFound/NotFound.jsx";
import AdminWorklogListPage from "./pages/admin/worklog/AdminWorklogListPage.jsx";

function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Public Route */}
                <Route path="/signin" element={<SignInPage />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="/projects" element={<ProjectPage />} />
                    <Route path="/tasksManager" element={<TaskPage />} />
                    <Route path="/workLog" element={<WorklogPage />} />
                    <Route path="/workingHistory" element={<WorkingHistoryPage />} />
                    <Route path="/workingHistoryWithAdmin" element={ <AdminWorklogListPage /> } />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/approval-management" element={<AdminLeaveApproval /> }/>
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
