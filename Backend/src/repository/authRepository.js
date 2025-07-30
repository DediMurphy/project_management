import prisma from "../db/index.js";

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserByUsername = async (username) => {
  return prisma.user.findFirst({
    where: { username },
    include: { role: true },
  });
};

export const createUser = async ({ username, email, password, roleId }) => {
  return prisma.user.create({
    data: { username, email, password, roleId },
  });
};
