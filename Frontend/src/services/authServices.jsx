import { setToken, removeToken} from "../utils/token.js";
import API from "../utils/api.js";

export const refreshTokenRequest = async () => {
    const res = await API.get("/api/v1/auth/token", { withCredentials: true });
    return res.data;
};

export const loginRequest = async (username, password) => {
    const res = await API.post("/api/v1/auth/login", { username, password });
    const { accessToken, user } = res.data.data;
    setToken(accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    return { accessToken, user };
};

export const registerRequest = async (username, email, password) => {
    const res = await API.post("/api/v1/auth/register", { username, email, password });
    return res.data;
};

export const logoutRequest = async () => {
    const res = await API.post("/api/v1/auth/logout");
    removeToken();
    localStorage.removeItem("user");
    return res.data;
};