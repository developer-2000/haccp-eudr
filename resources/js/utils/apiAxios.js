import axios from "axios";

const apiAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

apiAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiAxios;
