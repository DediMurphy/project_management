import bcrypt from "bcryptjs";

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
};

async function comparePassword(password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
};

export {
    hashPassword,
    comparePassword,
};