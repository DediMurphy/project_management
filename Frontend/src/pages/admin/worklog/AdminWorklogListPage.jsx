import { useEffect, useState } from "react";
import { useWorklogStore } from "../../../store/worklog/useWorklogStore.js";
import { useAuthStore } from "../../../store/auth/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/button/Button";
import Badge from "../../../components/ui/badge/Badge";
import { Modal } from "../../../components/ui/modal/Modal.jsx";
import Label from "../../../components/ui/label/Label.jsx";
import Input from "../../../components/ui/input/InputField";
import { Clock } from "lucide-react";
import TextArea from "../../../components/ui/input/TextArea";
import { useModal } from "../../../hooks/useModal.js";
import { toYMDDate } from "../../../utils/dateFormatter";

export default function AdminWorklogListPage() {
    const { worklogs, fetchAllLogs, addLog, editLog, removeLog } = useWorklogStore();
    const [selectedId, setSelectedId] = useState(null);
    const [selectedUser, setSelectedUser] = useState("");
    const [formMode, setFormMode] = useState("add");
    const [worklogTitle, setWorklogTitle] = useState("");
    const [worklogDescription, setWorklogDescription] = useState("");
    const [worklogStartTime, setWorklogStartTime] = useState("");
    const [worklogEndTime, setWorklogEndTime] = useState("");
    const [worklogDate, setWorklogDate] = useState("");
    const [worklogStatus, setWorklogStatus] = useState("");
    const [worklogComment, setWorklogComment] = useState("");
    const [worklogUserId, setWorklogUserId] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { isOpen, openModal, closeModal } = useModal();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAllLogs();
    }, [fetchAllLogs]);

    const resetForm = () => {
        setSelectedId(null);
        setWorklogTitle("");
        setWorklogDescription("");
        setWorklogStartTime("");
        setWorklogEndTime("");
        setWorklogDate("");
        setWorklogStatus("");
        setWorklogComment("");
        setFormMode("add");
    };

    const handleOpenEditModal = (worklog) => {
        setFormMode("edit");
        setSelectedId(worklog.work_log_id);
        setWorklogTitle(worklog.title);
        setWorklogDescription(worklog.description);
        setWorklogStartTime(worklog.startTime);
        setWorklogEndTime(worklog.endTime);
        setWorklogDate(toYMDDate(worklog.date));
        setWorklogStatus(worklog.status);
        setWorklogComment(worklog.comment);
        setWorklogUserId(worklog.userId);
        openModal();
    };

    const handleSaveWorklog = async () => {
        if (!worklogDate) return;
        if (!user?.user_id) {
            alert("User tidak ditemukan, Silahkan login ulang");
            return;
        }

        const worklogData = {
            title: worklogTitle,
            description: worklogDescription,
            startTime: worklogStartTime,
            endTime: worklogEndTime,
            date: worklogDate,
            status: worklogStatus || "Pending",
            comment: worklogComment,
            userId: worklogUserId || user.user_id,
        };

        if (formMode === "add") {
            await addLog(worklogData, worklogDate);
        } else if (selectedId !== null) {
            await editLog(selectedId, worklogData, worklogDate);
        }
        closeModal();
        resetForm();
    };

    const handleDeleteWorklog = async (id, date) => {
        if (confirm("Apakah Anda yakin ingin menghapus catatan kerja ini?")) {
            await removeLog(id, date);
            fetchAllLogs();
        }
    };

    const statusOptions = {
        "In Progress": "error",
        Completed: "success",
        Pending: "warning",
    };

    const userList = Array.from(
        new Set(worklogs.map((log) => log.username || log.user?.username || "-"))
    );

    const filteredLogs = worklogs
        .filter((log) => (selectedMonth ? log.date?.startsWith(selectedMonth) : true))
        .filter((log) => (selectedUser ? (log.username || log.user?.username) === selectedUser : true));

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <>
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Semua Catatan Kerja</h2>
                <div className="flex gap-3 items-center">
                    <select
                        className="rounded-lg border px-3 py-2 text-sm text-gray-700 dark:bg-gray-900 dark:text-white"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Semua User</option>
                        {userList.map((user, idx) => (
                            <option key={idx} value={user}>
                                {user}
                            </option>
                        ))}
                    </select>
                    <input
                        type="month"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        &larr; Kembali ke Kalender
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                        <tr>
                            <th className="px-5 py-3 text-center font-medium text-blue-500">User</th>
                            <th className="px-5 py-3 text-center font-medium text-blue-500">Judul</th>
                            <th className="px-5 py-3 text-center font-medium text-blue-500">Deskripsi</th>
                            <th className="px-5 py-3 text-center font-medium text-blue-500">Jam Mulai</th>
                            <th className="px-5 py-3 text-center font-medium text-blue-500">Jam Selesai</th>
                            <th className="px-5 py-3 text-center font-medium text-blue-500">Status</th>
                            <th className="px-5 py-3 text-center font-medium text-blue-500">Tanggal</th>
                            <th className="px-5 py-3 text-center font-medium text-blue-500">Komentar</th>
                            <th className="px-5 py-3 text-center font-medium text-blue-500">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {filteredLogs.length === 0 ? (
                            <tr>
                                <td className="px-4 py-5 text-center text-gray-500 dark:text-gray-400" colSpan={9}>
                                    Belum ada catatan kerja pada bulan ini.
                                </td>
                            </tr>
                        ) : (
                            paginatedLogs.map((worklog) => (
                                <tr key={worklog.work_log_id}>
                                    <td className="px-4 py-3 text-gray-500">{worklog.username || worklog.user?.username || "-"}</td>
                                    <td className="px-4 py-3 text-gray-500">{worklog.title}</td>
                                    <td className="px-4 py-3 text-gray-500">{worklog.description}</td>
                                    <td className="px-4 py-3 text-gray-500">{worklog.startTime}</td>
                                    <td className="px-4 py-3 text-gray-500">{worklog.endTime}</td>
                                    <td className="px-4 py-3 text-gray-500">
                                        <Badge size="sm" color={worklog.status === "Completed" ? "success" : worklog.status === "Pending" ? "warning" : "error"}>
                                            {worklog.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{worklog.date?.split("T")[0]}</td>
                                    <td className="px-4 py-3 text-gray-500">{worklog.comment}</td>
                                    <td className="px-4 py-3 text-gray-500">
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="primary" onClick={() => handleOpenEditModal(worklog)}>Edit</Button>
                                            <Button size="sm" variant="outline" onClick={() => handleDeleteWorklog(worklog.work_log_id, worklog.date)}>Hapus</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center py-4 gap-2">
                        <Button size="sm" variant="outline" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                            Prev
                        </Button>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
              Halaman {currentPage} dari {totalPages}
            </span>
                        <Button size="sm" variant="outline" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                            Next
                        </Button>
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
                <div className="flex flex-col px-2 overflow-y-auto max-h-[90vh] custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">{formMode === "add" ? "Tambah Catatan Kerja" : "Edit Catatan Kerja"}</h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formMode === "add" ? "Rencanakan catatan kerja baru Anda" : "Perbarui detail catatan kerja Anda"}</p>
                    </div>
                    <div className="mt-8">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Judul</label>
                            <input
                                id="worklog-title"
                                type="text"
                                value={worklogTitle}
                                onChange={(e) => setWorklogTitle(e.target.value)}
                                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                        </div>

                        <div className="mt-6">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Tanggal</label>
                            <input
                                type="date"
                                value={worklogDate}
                                onChange={(e) => setWorklogDate(e.target.value)}
                                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                        </div>

                        <div className="mt-6">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Komentar</label>
                            <input
                                id="worklog-comment"
                                type="text"
                                value={worklogComment}
                                onChange={(e) => setWorklogComment(e.target.value)}
                                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                        </div>

                        <div className="mt-6">
                            <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">Status</label>
                            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                                {Object.entries(statusOptions).map(([status, color]) => (
                                    <div key={status} className="n-chk">
                                        <div className={`form-check form-check-${color} form-check-inline`}>
                                            <label className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400" htmlFor={`modal${status}`}>
                        <span className="relative">
                          <input className="sr-only form-check-input" type="radio" name="worklog-status" value={status} id={`modal${status}`} checked={worklogStatus === status} onChange={() => setWorklogStatus(status)} />
                          <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                            <span className={`h-2 w-2 rounded-full bg-white ${worklogStatus === status ? "block" : "hidden"}`}></span>
                          </span>
                        </span>
                                                {status}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="worklog-start-time">Jam Mulai</Label>
                            <div className="relative">
                                <Input type="time" id="worklog-start-time" name="worklog-start-time" value={worklogStartTime} onChange={(e) => setWorklogStartTime(e.target.value)} />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <Clock className="size-6" />
                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="worklog-end-time">Jam Selesai</Label>
                            <div className="relative">
                                <Input type="time" id="worklog-end-time" name="worklog-end-time" value={worklogEndTime} onChange={(e) => setWorklogEndTime(e.target.value)} />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <Clock className="size-6" />
                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Deskripsi</label>
                                <TextArea value={worklogDescription} onChange={(value) => setWorklogDescription(value)} rows={6} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                            <button
                                onClick={closeModal}
                                type="button"
                                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                            >
                                Tutup
                            </button>
                            <button onClick={handleSaveWorklog} type="button" className="btn btn-success flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto">
                                {formMode === "add" ? "Tambah Catatan Kerja" : "Perbarui Catatan Kerja"}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
