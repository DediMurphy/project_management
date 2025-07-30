import API from "../utils/api";

export const getAllUsers = async () => {
    const res = await API.get("/api/v1/users");
    return res.data;
};