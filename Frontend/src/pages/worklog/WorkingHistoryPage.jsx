import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table/Table.jsx";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal/Modal.jsx";
import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import TextArea from "../../components/ui/input/TextArea";
import { useWorklogStore } from "../../store/worklog/useWorklogStore.js";
import Label from "../../components/ui/label/Label";
import Input from "../../components/ui/input/InputField";
import { TimeIcon } from "../../icons";
import { useSearchParams } from "react-router-dom";
import { toYMDDate } from "../../utils/dateFormatter";
import { useAuthStore } from "../../store/auth/useAuthStore.js";
import { Edit, Trash2} from "lucide-react";


export default function WorkingHistoryPage() {
    const { worklogs, fetchLogsByDate, addLog, editLog, removeLog} = useWorklogStore();
    const [selectedId, setSelectedId] = useState(null);
    const [formMode, setFormMode] = useState("add");
    const [worklogTitle, setWorklogTitle] = useState("");
    const [worklogDescription, setWorklogDescription] = useState("");
    const [worklogStartTime, setWorklogStartTime] = useState("");
    const [worklogEndTime, setWorklogEndTime] = useState("");
    const [worklogDate, setWorklogDate] = useState("");
    const [worklogStatus, setWorklogStatus] = useState("");
    const [worklogComment, setWorklogComment] = useState("");
    const { isOpen, openModal, closeModal } = useModal();
    const [params] = useSearchParams();
    const { user } = useAuthStore();
    const selectedDate = params.get("date") ?? toYMDDate(new Date());

    const refreshWork = async () => {
        await fetchLogsByDate(selectedDate);
    };

    useEffect(() => {
        if (selectedDate) {
            refreshWork();
            setWorklogDate(selectedDate);
        }
    }, [selectedDate]);

    const filteredWorklogs = worklogs.filter((log) => {
        const logDate = log.date.includes("T") ? log.date.split("T")[0] : log.date;
        return logDate === selectedDate;
    });

    const resetForm = () => {
        setSelectedId(null);
        setWorklogTitle("");
        setWorklogDescription("");
        setWorklogStartTime("");
        setWorklogEndTime("");
        setWorklogDate(selectedDate);
        setWorklogStatus("");
        setWorklogComment("");
        setFormMode("add");
    };

    const handleOpenAddModal = () => {
        resetForm();
        openModal();
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
        openModal();
    };

    const handleSaveWorklog = async () => {
        if (!user?.user_id) return;
        const worklogData = {
            title: worklogTitle,
            description: worklogDescription,
            startTime: worklogStartTime,
            endTime: worklogEndTime,
            date: worklogDate,
            status: worklogStatus || "Pending",
            comment: worklogComment,
            userId: user.user_id,
        };
        try {
            if (formMode === "add") {
                await addLog(worklogData, selectedDate);
            } else {
                if (selectedId) {
                    await editLog(selectedId, worklogData, selectedDate);
                }
            }
            await refreshWork();
            closeModal();
            resetForm();
        } catch (err) {
            console.error("Gagal menyimpan worklog", err);
        }
    };

    const handleDeleteWorklog = async (id) => {
        if (confirm("Yakin ingin menghapus catatan ini?")) {
            await removeLog(id, selectedDate);
            await refreshWork();
        }
    };

    const statusOptions = {
        "In Progress": "error",
        Completed: "success",
        Pending: "warning",
    };

    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Working History</h2>
                <Button variant="primary" onClick={handleOpenAddModal}>
                    Tambah Catatan Kerja +
                </Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-start text-theme-xs dark:text-gray-400">
                                    Judul
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-start text-theme-xs dark:text-gray-400">
                                    Deskripsi
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-start text-theme-xs dark:text-gray-400">
                                    Jam Mulai
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-start text-theme-xs dark:text-gray-400">
                                    Jam Selesai
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-start text-theme-xs dark:text-gray-400">
                                    Status
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-start text-theme-xs dark:text-gray-400">
                                    Tanggal
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-start text-theme-xs dark:text-gray-400">
                                    Komentar
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-start text-theme-xs dark:text-gray-400">
                                    Dikerjakan
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-start text-theme-xs dark:text-gray-400">
                                    Aksi
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {filteredWorklogs.length === 0 ? (
                                <TableRow>
                                    <TableCell className="px-4 py-5 text-center text-gray-500 dark:text-gray-400" colSpan={9}>
                                        Tidak ada catatan kerja untuk tanggal {selectedDate}.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredWorklogs.map((worklog) => (
                                    <TableRow key={worklog.work_log_id}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{worklog.title}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{worklog.description}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{worklog.startTime}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{worklog.endTime}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Badge size="sm" color={worklog.status === "Completed" ? "success" : worklog.status === "Pending" ? "warning" : "error"}>
                                                {worklog.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{worklog.date.includes("T") ? worklog.date.split("T")[0] : worklog.date}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{worklog.comment}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{worklog.user?.username}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(worklog)}
                                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} className="text-gray-600 dark:text-white" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteWorklog(worklog.work_log_id)}
                                                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-700 transition"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
                <div className="flex flex-col px-2 overflow-y-auto max-h-[90vh] custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                            {formMode === "add" ? "Tambah Catatan Kerja" : `Edit Catatan Kerja (ID: ${selectedId})`}
                        </h5>
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
                  <TimeIcon className="size-6" />
                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="worklog-end-time">Jam Selesai</Label>
                            <div className="relative">
                                <Input type="time" id="worklog-end-time" name="worklog-end-time" value={worklogEndTime} onChange={(e) => setWorklogEndTime(e.target.value)} />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <TimeIcon className="size-6" />
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
        </div>
    );
}