import prisma from '../db/index.js';

export const findProjects = async () => {
    return prisma.project.findMany();
};

export const findProjectById = async (projectId) => {
    return prisma.project.findUnique({
        where: {
            project_id: projectId,
        },
    });
};

export const createProject = async (newProject) => {
    return prisma.project.create({
        data: {
            project_name: newProject.project_name,
            createdById: newProject.createdById,
            updateBy: newProject.updateBy,
            updateAt: new Date(),
        },
    });
};

export const updateProject = async (projectId, updatedProject) => {
    return prisma.project.update({
        where: {
            project_id: projectId,
        },
        data: {
            project_name: updatedProject.project_name,
            updateBy: updatedProject.updateBy,
            updateAt: new Date(),
        },
    });
};

export const deleteProject = async (projectId) => {
    return prisma.project.delete({
        where: {
            project_id: projectId,
        },
    });
};