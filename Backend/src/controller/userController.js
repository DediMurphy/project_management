import prisma from "../db/index.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                user_id: true,
                username: true,
                role: true,
            },
        });
        res.json(users);
    } catch (error) {
        console.error("Error getAllUsers:", error);
        res.status(500).json({ message: "Gagal mengambil data user" });
    }
};
