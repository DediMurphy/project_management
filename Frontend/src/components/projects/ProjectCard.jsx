import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../../store/project/useProjectStore.js";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal/Modal.jsx";
import Input from "../ui/input/InputField.jsx";
import Label from "../ui/label/Label.jsx";
import { useAuthStore } from "../../store/auth/useAuthStore.js";
import { Edit, Trash2 } from "lucide-react";
import Alert from "../ui/alert/Alert.jsx";

export default function ProjectCard() {
  const navigate = useNavigate();
  const { projects, fetchProjects, addProject, editProject, removeProject, loading, error } = useProjectStore();
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [createdById] = useState(1); // default user id
  const [updateBy] = useState("admin");
  const [selectedId, setSelectedId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => setAlertInfo(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  const handleSave = async () => {
    if (!projectName) {
      return;
    }

    if (isEditMode && selectedId !== null) {
      await editProject(selectedId, { project_name: projectName, updateBy });
      setAlertInfo({
        variant: "success",
        title: "Project telah diupdate",
        message: "update berhasil",
      });
    } else {
      await addProject({ project_name: projectName, createdById, updateBy });
      setAlertInfo({
        variant: "success",
        title: "Project telah ditambahkan",
        message: "tambah berhasil",
      });
    }

    setProjectName("");
    setIsOpen(false);
    setIsEditMode(false);
    setSelectedId(null);
  };

  const handleEditClick = (project) => {
    setProjectName(project.project_name);
    setSelectedId(project.project_id);
    setIsEditMode(true);
    setIsOpen(true);
  };

  const handleDeleteClick = async (projectId) => {
    if (window.confirm("Yakin ingin menghapus project ini?")) {
      await removeProject(projectId);
      setAlertInfo({
        variant: "success",
        title: "Project Berhasil dihapus",
        message: "Telah di hapus.",
      });
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/tasksManager?projectId=${projectId}`);
  };

  return (
    <div>
      <h2 className="text-center text-xl font-semibold text-gray-800 dark:text-white mb-6">Welcome</h2>

      {loading && <p className="text-gray-500">Memuat...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {alertInfo && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert variant={alertInfo.variant} title={alertInfo.title} message={alertInfo.message} showLink={false} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.project_id}
            onClick={() => handleProjectClick(project.project_id)}
            className={`cursor-pointer group rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between gap-4 ${
              selectedId === project.project_id ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-xl text-blue-600 dark:text-blue-300">💻</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-500 transition">{project.project_name}</h3>
              </div>
              <span className="text-xs text-gray-500 dark:text-white/40">{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-white/60 mt-4">Lihat Task</div>

            {(user?.role === "admin" || user?.role === "hrd") && (
              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(project);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <Edit size={18} className="text-gray-600 dark:text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(project.project_id);
                  }}
                  className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-700 transition"
                >
                  <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {(user?.role === "admin" || user?.role === "hrd") && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-black shadow-lg hover:bg-gray-300 dark:bg-white/10 dark:text-white">
          +
        </button>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-md p-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{isEditMode ? "Edit Project" : "Tambah Project Baru"}</h4>
        <div>
          <Label htmlFor="project_name">Nama Project</Label>
          <Input id="project_name" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Masukkan nama project" />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Simpan
          </Button>
        </div>
      </Modal>
    </div>
  );
}
