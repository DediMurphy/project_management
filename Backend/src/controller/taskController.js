import sendResponse from "../middlewares/responseFormatter.js";
import * as taskService from "../service/taskService.js";

export const getAllTasks = async (req, res, next) => {
    try {
        const { projectId } = req.query;

        const tasks = projectId
            ? await taskService.getTasksByProjectId(parseInt(projectId))
            : await taskService.getAllTasks();
        sendResponse(res, {
            statusCode: 200,
            message: "Tasks retrieved successfully",
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const task = await taskService.getTaskById(id);
        sendResponse(res, {
            statusCode: 200,
            message: "Task retrieved successfully",
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

export const createTask = async (req, res, next) => {
    try {
        const taskData = req.body;
        const user = req.user; 
        const fullTaskData = {
            ...taskData,
            createdBy: user.user_id,
            updateBy: user.user_id,
            logs: taskData.logs || [],
        };

        const task = await taskService.createNewTask(fullTaskData);
        sendResponse(res, {
            statusCode: 201,
            message: "Task created successfully",
            data: task,
        });
    } catch (error) {
        next(error);
    }
};


export const updateTask = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const taskData = req.body;
        const user = req.user;
        const fullData = {
            ...taskData,
            updateBy: user.user_id 
        };
        const updatedTask = await taskService.updateTaskById(id, fullData);
        sendResponse(res, {
            statusCode: 200,
            message: "Task update successfully",
            data: updatedTask,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const task = await taskService.deleteTaskById(id);
        sendResponse(res, {
            statusCode: 200,
            message: "Task deleted successfully",
            data: task,
        });
    } catch (error) {
        next(error);
    }
};