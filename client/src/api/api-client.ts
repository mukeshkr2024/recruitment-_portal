import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    // baseURL: "https://cloudprism.in/api/v1",
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
