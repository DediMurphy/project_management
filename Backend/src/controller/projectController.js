import sendResponse from '../middlewares/responseFormatter.js';
import { projectService } from '../service/projectService.js';


export const create = async (req, res, next) => {
    try {
        const { project_name, createdById, updateBy } = req.body;
        const project = await projectService.create({ project_name, createdById, updateBy });
        sendResponse(res, {
            message: 'Project created successfully',
            data: project });
    } catch (err) {
        next(err);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const projects = await projectService.getAll();
        sendResponse(res, { data: projects });
    } catch (err) {
        next(err);
    }
};

export const getById = async (req, res, next) => {
    try {
        const project = await projectService.getById(parseInt(req.params.id));
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        sendResponse(res, { message: 'Success',data: project });
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const project = await projectService.update(parseInt(req.params.id), req.body);
        sendResponse(res, { message: 'Project updated successfully', data: project });
    } catch (err) {
        next(err);
    }
};

export const remove = async (req, res, next) => {
    try {
        await projectService.delete(parseInt(req.params.id));
        sendResponse(res, { message: 'Project deleted successfully' });
    } catch (err) {
        next(err);
    }
};
