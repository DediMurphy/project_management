import { getToken, setToken, removeToken } from "./token";
import { refreshTokenRequest } from "../services/authServices.jsx";

export const setupInterceptors = (API) => {
    API.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    API.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const { data } = await refreshTokenRequest();
                    setToken(data.data.accessToken);
                    originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                    return API(originalRequest);
                } catch {
                    removeToken();
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        }
    );
};
