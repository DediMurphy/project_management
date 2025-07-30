import { create } from "zustand";
import { getToken, removeToken, isTokenExpired } from "../../utils/token.js";
import { logoutRequest } from "../../services/authServices.jsx";

const initialUser = JSON.parse(localStorage.getItem("user") || "null");

export const useAuthStore = create((set, get) => ({
    user: initialUser,

    isAuthenticated: () => {
        const token = getToken();
        const user = get().user;
        return !!(token && !isTokenExpired(token) && user);
    },

    setUser: (user) => {
        set({ user });
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    },

    clearUser: () => {
        set({ user: null });
        localStorage.removeItem("user");
        removeToken();
    },

    checkAuth: () => {
        const token = getToken();
        const user = get().user;

        if (!token || isTokenExpired(token) || !user) {
            get().clearUser();
            return false;
        }

        return true;
    },

    logout: async () => {
        try {
            await logoutRequest();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            get().clearUser();
            window.location.href = "/signin";
        }
    }
}));
