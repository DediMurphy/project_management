import { useState } from "react";
import { loginRequest, registerRequest } from "../services/authServices.jsx";
import { useAuthStore } from "../store/auth/useAuthStore.js";
import { setToken } from "../utils/token";

export const useAuth = () => {
    const [error, setError] = useState("");
    const { setUser } = useAuthStore();

    const login = async (username, password) => {
        try {
            const { accessToken, user } = await loginRequest(username, password);
            setToken(accessToken);
            setUser(user);
            setError("");
            return true;
        } catch (error) {
            setError(error?.response?.data?.message);
            return false;
        }
    };

    const register = async (username, email, password) => {
        try {
            await registerRequest(username, email, password);
            setError("");
            return true;
        } catch (error) {
            setError(error?.response?.data?.message);
            return false;
        }
    };

    return { login, register, error };
};
