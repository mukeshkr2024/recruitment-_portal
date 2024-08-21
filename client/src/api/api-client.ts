import axios from "axios";

export const apiClient = axios.create({
    // baseURL: "http://localhost:8080/api/v1",
    baseURL: "https://cloudprism.in/api/v1",
    withCredentials: true,
});

// Add a request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('access_token');
        if (token) {
            // Attach the token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle any errors that occur during the request setup
        return Promise.reject(error);
    }
);
