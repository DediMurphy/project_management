import prisma from "../db/index.js";

export const findTask = async () => {
    return prisma.task.findMany({
        include: {
            creator: true, 
            updater: true, 
        },
    });
};

export const findTaskById = async (taskId) => {
    return prisma.task.findUnique({
        where: {
            task_id: taskId,
        },
        include: {
            creator: true, 
            updater: true, 
        },
    });
};

export const createTask = async (newTask) => {
    return prisma.task.create({
        data: {
            title: newTask.title,
            description: newTask.description,
            status: newTask.status,
            assigneeId: newTask.assigneeId,
            image: newTask.image,
            priority: newTask.priority,
            datetime: newTask.datetime ? new Date(newTask.datetime) : new Date(),
            createdBy: newTask.createdBy,
            updateBy: newTask.updateBy,
            projectId: newTask.projectId,
            logs: newTask.logs || [], 
        }
    });
};

export const updateTask = async (taskId, updatedTask) => {
    const existingTask = await prisma.task.findUnique({ 
        where: { task_id: taskId },
        select: { logs: true }
    });

    const currentLogs = existingTask?.logs || [];
    let newLogs = updatedTask.logs !== undefined ? updatedTask.logs : currentLogs;

    if (!Array.isArray(newLogs)) {
        newLogs = [];
    }

    return prisma.task.update({
        where: { task_id: taskId },
        data: {
            title: updatedTask.title,
            description: updatedTask.description,
            status: updatedTask.status,
            image: updatedTask.image,
            priority: updatedTask.priority,
            updateAt: new Date(), 
            updateBy: updatedTask.updateBy, 
            logs: newLogs, 
        },
        include: { 
            creator: true,
            updater: {
                select: {
                    user_id: true,
                    username: true
                }
            },
        }
    });
};

export const deleteTask = async (taskId) => {
    return prisma.task.delete({
        where: {
            task_id: taskId,
        }
    });
};

export const findTasksByProjectId = async (projectId) => {
    return prisma.task.findMany({
        where: {
            projectId: projectId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            creator: true, 
            updater: true, 
        },
    });
};