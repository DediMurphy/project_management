import prisma from "../db/index.js";
import sendResponse from "../middlewares/responseFormatter.js";

// Create Role
export const createRole = async (req, res, next) => {
  try {
    const { role_name, createdBy } = req.body;
    if (!role_name) return res.status(400).json({ message: "Role name is required" });
    const exist = await prisma.role.findUnique({ where: { role_name } });
    if (exist) return res.status(400).json({ message: "Role already exists" });
    const now = new Date();
    const role = await prisma.role.create({
      data: {
        role_name,
        createdBy: createdBy || req.user?.username || 'system',
        updateAt: now,
        updateBy: createdBy || req.user?.username || 'system',
      }
    });
    sendResponse(res, { statusCode: 201, message: "Role created successfully", data: role });
  } catch (error) { next(error); }
};

export const getRoles = async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany();
    sendResponse(res, {
      statusCode: 200,
      message: "Roles fetched successfully",
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

// Update Role
export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params; // id = role_id
    const { role_name, updateBy } = req.body;
    const now = new Date();
    const updated = await prisma.role.update({
      where: { role_id: parseInt(id) },
      data: {
        role_name,
        updateAt: now,
        updateBy: updateBy || req.user?.username || 'system',
      },
    });
    sendResponse(res, { statusCode: 200, message: "Role updated", data: updated });
  } catch (error) { next(error); }
};

// Delete Role
export const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params; // id = role_id
    await prisma.role.delete({ where: { role_id: parseInt(id) } });
    sendResponse(res, { statusCode: 200, message: "Role deleted", data: null });
  } catch (error) { next(error); }
};