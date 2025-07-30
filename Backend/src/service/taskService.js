import { findTaskById,findTasksByProjectId, createTask, findTask, deleteTask, updateTask } from "../repository/taskRepository.js";

export const getAllTasks = async () => {
    return await findTask();
}

export const getTaskById = async (taskId) => {
    const task = await findTaskById(taskId);
    return task;
}

export const createNewTask = async (taskData) => {
    return await createTask(taskData);
}

export const deleteTaskById = async (taskId) => {
    const task = await deleteTask(taskId);
    return task;
}

export const updateTaskById = async (taskId, taskData) => {
    await getTaskById(taskId);
    return await updateTask(taskId, taskData);
}

export const getTasksByProjectId = async (projectId) => {
  return await findTasksByProjectId(projectId);
};