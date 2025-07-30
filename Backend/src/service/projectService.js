import {
    findProjects,
    findProjectById,
    createProject,
    updateProject,
    deleteProject
} from '../repository/projectRepository.js';

export const projectService = {
    create: async (data) => createProject(data),
    getAll: async () => findProjects(),
    getById: async (id) => findProjectById(id),
    update: async (id, data) => updateProject(id, data),
    delete: async (id) => deleteProject(id),
};
