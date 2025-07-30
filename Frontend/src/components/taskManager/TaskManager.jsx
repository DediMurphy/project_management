import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table/Table.jsx";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal/Modal.jsx";
import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import TextArea from "../ui/input/TextArea.jsx";
import { useTaskStore } from "../../store/task/useTaskStore.js";
import Label from "../ui/label/Label";
import Input from "../ui/input/InputField.jsx";
import Badge from "../ui/badge/Badge";
import { useSearchParams } from "react-router-dom";
import { getProjectById } from "../../services/projectServices.jsx";
import { useAuthStore } from "../../store/auth/useAuthStore.js";
import { isGetByUsername } from "../../utils/permissionUser.js";
import { Edit, Trash2, FileText, Dot } from "lucide-react";

export default function TaskManager() {
  const { tasks, fetchTasksByProjectId, addTask, editTask, removeTask, loading, error } = useTaskStore();
  const [selectedId, setSelectedId] = useState(null);
  const [formMode, setFormMode] = useState("add");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [datetime, setDatetime] = useState("");
  const [assigneeId, setAssigneeId] = useState(1);
  const [image, setImage] = useState("");
  const [createdBy, setCreatedBy] = useState(null);
  const [updateBy, setUpdateBy] = useState(null);
  const [projectName, setProjectName] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isLogModalOpen, openModal: openLogModal, closeModal: closeLogModal } = useModal();
  const [logStatus, setLogStatus] = useState("");
  const [logComment, setLogComment] = useState("");
  const [currentTaskForLog, setCurrentTaskForLog] = useState(null);
  const { user } = useAuthStore();

  const [params] = useSearchParams();
  const projectId = parseInt(params.get("projectId") || "0", 10);

  const bubbleSort = (arr, key = "title", order = "asc") => {
    const sortedArray = [...arr];
    const n = sortedArray.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        let condition = false;

        if (key === "datetime") {
          const dateA = new Date(sortedArray[j].datetime);
          const dateB = new Date(sortedArray[j + 1].datetime);
          condition = order === "asc" ? dateA > dateB : dateA < dateB;
        } else if (key === "status") {
          const statusOrder = { Completed: 1, Progress: 2,Pending: 3, };
          const statusA = statusOrder[sortedArray[j].status] || 0;
          const statusB = statusOrder[sortedArray[j + 1].status] || 0;
          condition = order === "asc" ? statusA > statusB : statusA < statusB;
        } else {
          const valueA = sortedArray[j][key]?.toString().toLowerCase() || "";
          const valueB = sortedArray[j + 1][key]?.toString().toLowerCase() || "";
          condition = order === "asc" ? valueA > valueB : valueA < valueB;
        }

        if (condition) {
          [sortedArray[j], sortedArray[j + 1]] = [sortedArray[j + 1], sortedArray[j]];
        }
      }
    }

    return sortedArray;
  };

  const [sortConfig, setSortConfig] = useState({ key: null, order: "asc", algorithm: "bubble" });
  const [sortedTasks, setSortedTasks] = useState([]);

  useEffect(() => {
    if (tasks.length > 0) {
      let sorted = [...tasks];

      if (sortConfig.key) {
        if (sortConfig.algorithm === "bubble") {
          sorted = bubbleSort(tasks, sortConfig.key, sortConfig.order);
        }
      }

      setSortedTasks(sorted);
    } else {
      setSortedTasks([]);
    }
  }, [tasks, sortConfig]);

  const handleSort = (key, algorithm = "bubble") => {
    const newOrder = sortConfig.key === key && sortConfig.order === "asc" ? "desc" : "asc";
    setSortConfig({ key, order: newOrder, algorithm });
  };

  useEffect(() => {
    if (projectId) {
      fetchTasksByProjectId(projectId);
      getProjectById(projectId).then((res) => {
        setProjectName(res.project_name);
      });
    }
  }, [projectId, fetchTasksByProjectId]);

  const resetForm = () => {
    setSelectedId(null);
    setTitle("");
    setDescription("");
    setStatus("");
    setPriority("");
    setDatetime("");
    setAssigneeId(1);
    setImage("");
    setCreatedBy(null);
    setUpdateBy(null);
    setFormMode("add");
  };

  const handleOpenAddModal = () => {
    resetForm();
    setCreatedBy(user?.user_id || null);
    openModal();
  };

  const handleOpenEditModal = (task) => {
    setFormMode("edit");
    setSelectedId(task.task_id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
    setDatetime(task.datetime.split("T")[0]);
    setAssigneeId(task.assigneeId);
    setImage(task.image);
    setCreatedBy(task.createdBy);
    setUpdateBy(user?.user_id || null);
    openModal();
  };

  const handleSaveTask = async () => {
    if (!user?.user_id && formMode === "add") {
      console.error("User ID is required to create a task.");
      return;
    }

    const taskData = {
      title,
      description,
      status: status || "Pending",
      priority: priority || "Low",
      datetime: datetime || new Date().toISOString(),
      assigneeId,
      image,
      projectId,
      createdBy: formMode === "add" ? user?.user_id || null : createdBy,
      updateBy: user?.user_id || null,
      logs: formMode === "edit" && selectedId ? tasks.find((t) => t.task_id === selectedId)?.logs : [],
    };

    if (formMode === "add") {
      await addTask(taskData);
    } else if (selectedId !== null) {
      await editTask(selectedId, taskData);
    }

    await fetchTasksByProjectId(projectId);
    closeModal();
    resetForm();
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      await removeTask(id);
      await fetchTasksByProjectId(projectId);
    }
  };

  const handleOpenLogModal = (task) => {
    setCurrentTaskForLog(task);
    setLogStatus(task.status);
    setLogComment("");
    openLogModal();
    console.log("Task for log modal:", task);
    console.log("Logs array:", task.logs);
  };

  const handleSaveLog = async () => {
    if (!currentTaskForLog) return;
    if (!user?.user_id) {
      console.error("User ID is required to save a log.");
      return;
    }

    const newLogEntry = {
      status: logStatus,
      comment: logComment,
      timestamp: new Date().toISOString(),
      by: user?.username || "Guest",
    };

    const updatedLogs = [...(currentTaskForLog.logs || []), newLogEntry];

    const updatedTaskData = {
      ...currentTaskForLog,
      status: logStatus,
      logs: updatedLogs,
      updateBy: user?.user_id || null,
    };

    await editTask(currentTaskForLog.task_id, updatedTaskData);
    await fetchTasksByProjectId(projectId);
    closeLogModal();
    setCurrentTaskForLog(null);
    setLogStatus("");
    setLogComment("");
  };

  const statusOptions = {
    Progress: "info",
    Pending: "warning",
    Completed: "success",
  };

  const priorityOptions = {
    Low: "warning",
    Medium: "info",
    High: "error",
  };

  if (loading) return <p className="p-4 text-gray-500">Memuat data...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Manajemen Tugas</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          {/* Sorting Controls */}
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
            <select
              className="px-3 py-1 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) => {
                const [key, algorithm] = e.target.value.split("-");
                if (key) handleSort(key, algorithm);
              }}
            >
              <option value="">Default</option>
              <option value="title-bubble">Title</option>
              <option value="status-bubble">Status</option>
              <option value="datetime-bubble">Date</option>
            </select>
          </div>
          {isGetByUsername(user?.username) && (
            <Button variant="primary" onClick={handleOpenAddModal}>
              Tambah Tugas +
            </Button>
          )}
        </div>
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
                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-center text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-center text-theme-xs dark:text-gray-400">
                  Prioritas
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-center text-theme-xs dark:text-gray-400">
                  Tanggal
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-start text-theme-xs dark:text-gray-400">
                  Project
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-start text-theme-xs dark:text-gray-400">
                  Created
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-blue-500 text-center text-theme-xs dark:text-gray-400">
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {(sortedTasks.length > 0 ? sortedTasks : tasks).map((task) => (
                <TableRow key={task.task_id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{task.title}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{task.description}</TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex flex-col items-center gap-2">
                      <Badge size="sm" color={statusOptions[task.status] || "gray"}>
                        {task.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge size="sm" color={priorityOptions[task.priority] || "gray"}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm text-center dark:text-gray-400">{new Date(task.datetime).toLocaleDateString()}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{projectName}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{task.creator?.username || "N/A"}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      {isGetByUsername(user?.username) && (
                        <>
                          <button onClick={() => handleOpenEditModal(task)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="Edit">
                            <Edit size={18} className="text-gray-600 dark:text-white" />
                          </button>
                          <button onClick={() => handleDeleteTask(task.task_id)} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-700 transition" title="Hapus">
                            <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleOpenLogModal(task)} className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-700 transition" title="Lihat Log & Update Status">
                        <FileText size={18} className="text-blue-600 dark:text-blue-300" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal for Add/Edit Task */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
        <div className="flex flex-col px-2 overflow-y-auto max-h-[90vh] custom-scrollbar">
          <h5 className="mb-2 font-semibold text-gray-800 dark:text-white text-xl">{formMode === "add" ? "Tambah Tugas" : "Edit Tugas"}</h5>

          <Label htmlFor="title">Judul</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />

          <Label htmlFor="description" className="mt-4">
            Deskripsi
          </Label>
          <TextArea value={description} onChange={setDescription} rows={4} />

          <Label className="mt-4">Status</Label>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusOptions).map(([key]) => (
              <label key={key} className="flex items-center gap-2">
                <input type="radio" value={key} checked={status === key} onChange={() => setStatus(key)} />
                <span>{key}</span>
              </label>
            ))}
          </div>

          <Label className="mt-4">Prioritas</Label>
          <div className="flex gap-3">
            {Object.entries(priorityOptions).map(([key]) => (
              <label key={key} className="flex items-center gap-2">
                <input type="radio" value={key} checked={priority === key} onChange={() => setPriority(key)} />
                {key}
              </label>
            ))}
          </div>

          <Label className="mt-4">Tanggal</Label>
          <Input type="date" value={datetime.split("T")[0]} onChange={(e) => setDatetime(e.target.value)} />

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveTask}>
              {formMode === "add" ? "Tambah" : "Perbarui"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal for Task Log and Status Update */}
      <Modal isOpen={isLogModalOpen} onClose={closeLogModal} className="max-w-[600px] p-6 lg:p-10">
        <div className="flex flex-col px-2 overflow-y-auto max-h-[90vh] custom-scrollbar">
          <h5 className="mb-2 font-semibold text-gray-800 dark:text-white text-xl">Update Status & Log for "{currentTaskForLog?.title}"</h5>

          <Label className="mt-4">Pilih Status Baru</Label>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusOptions).map(([key]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={key} checked={logStatus === key} onChange={() => setLogStatus(key)} className="form-radio text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">{key}</span>
              </label>
            ))}
          </div>

          <Label htmlFor="log-comment" className="mt-4">
            Komentar
          </Label>
          <TextArea id="log-comment" value={logComment} onChange={setLogComment} rows={4} placeholder="Tambahkan komentar Anda tentang perubahan status ini..." />

          {currentTaskForLog?.logs && currentTaskForLog.logs.length > 0 && (
            <div className="mt-6">
              <h6 className="font-semibold text-gray-700 dark:text-white mb-2">Riwayat Log:</h6>
              <div className="relative border-l-2 border-gray-200 dark:border-white/[0.1] pl-6 max-h-48 overflow-y-auto custom-scrollbar">
                {currentTaskForLog.logs
                  .slice()
                  .reverse()
                  .map((log, index) => (
                    <div key={index} className="mb-4 relative pb-4">
                      <div className="absolute -left-3 top-0 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white shadow">
                        <Dot size={20} />
                      </div>
                      <p className="text-sm ml-4 text-gray-600 dark:text-gray-400 leading-tight">
                        Status berubah menjadi <span className={`font-semibold ${statusOptions[log.status] ? `text-${statusOptions[log.status]}-600` : "text-gray-600"}`}>{log.status}</span> oleh{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-300">{log.by}</span>
                      </p>
                      <p className="text-xs ml-4 text-gray-500 dark:text-gray-400 mt-0.5">pada {new Date(log.timestamp).toLocaleString()}</p>
                      {log.comment && <p className="text-gray-800 ml-4 dark:text-gray-200 text-sm italic mt-1">"{log.comment}"</p>}
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={closeLogModal}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveLog}>
              Simpan Log & Perbarui Status
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
