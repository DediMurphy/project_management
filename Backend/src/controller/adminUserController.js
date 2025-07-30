import { hashPassword } from "../utils/hash.js";
import prisma from "../db/index.js";
import sendResponse from "../middlewares/responseFormatter.js";

export const createUserByAdmin = async (req, res, next) => {
  try {
    const { username, email, password, roleId } = req.body;
    if (!username || !email || !password || !roleId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existUser = await prisma.user.findUnique({ where: { email } });
    if (existUser) return res.status(400).json({ message: "User already exists" });
    const role = await prisma.role.findUnique({ where: { role_id: roleId } });
    if (!role) return res.status(400).json({ message: "Role not found" });
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, roleId },
      include: { role: true },
    });
    sendResponse(res, {
      statusCode: 201,
      message: "User created successfully by admin",
      data: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role?.role_name,
      },
    });
  } catch (error) { next(error); }
};


// Get all users (admin only)
export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
    });
    sendResponse(res, {
      statusCode: 200,
      message: "Users fetched successfully",
      data: users.map((u) => ({
        user_id: u.user_id,
        username: u.username,
        email: u.email,
        role: u.role ? u.role.role_name : null,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Update user (admin only)
export const updateUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, password, roleId } = req.body;
    const userData = {};
    if (username) userData.username = username;
    if (email) userData.email = email;
    if (roleId) userData.roleId = roleId;
    if (password) userData.password = await hashPassword(password);
    const updated = await prisma.user.update({
      where: { user_id: parseInt(id) },
      data: userData,
      include: { role: true },
    });
    sendResponse(res, {
      statusCode: 200,
      message: "User updated successfully by admin",
      data: {
        user_id: updated.user_id,
        username: updated.username,
        email: updated.email,
        role: updated.role.role_name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { user_id: parseInt(id) } });
    sendResponse(res, {
      statusCode: 200,
      message: "User deleted successfully by admin",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};