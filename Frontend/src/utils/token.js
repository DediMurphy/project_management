export const setToken = (token) => {
    localStorage.setItem("accessToken", token);
}

export const getToken = () => {
    return localStorage.getItem("accessToken");
}

export const removeToken = () => {
    localStorage.removeItem("accessToken");
};

export function isTokenExpired(token) {
    if (!token) return true;
    try {
        const [, payloadBase64] = token.split('.');
        const payload = JSON.parse(atob(payloadBase64));
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
}

