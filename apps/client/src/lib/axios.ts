import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Type definitions
interface AuthRequest extends AxiosRequestConfig {
    _retry?: boolean;
}

interface TokenRefreshResponse {
    accessToken: string;
}

interface QueueItem {
    resolve: (token: string) => void;
    reject: (error: Error) => void;
}

// State variables
let isRefreshing = false;
let queue: QueueItem[] = [];
let authLogoutCallback: (() => void) | null = null;

const processQueue = (error: Error | null, token: string | null) => {
    queue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else if (token) {
            resolve(token);
        }
    });
    queue = [];
};

// Auth state management
export const setAuthLogoutCallback = (callback: () => void) => {
    authLogoutCallback = callback;
};

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Refresh token on 401
axiosInstance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const originalRequest = error.config as AuthRequest;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({
                        resolve: (token: string) => {
                            if (!originalRequest.headers) {
                                originalRequest.headers = {};
                            }
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(axiosInstance(originalRequest));
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;
            try {
                const res = await axios.post<TokenRefreshResponse>(
                    "/api/v1/auth/refresh",
                    {},
                    {
                        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
                    },
                );

                const newToken = res.data.accessToken;
                localStorage.setItem("accessToken", newToken);
                processQueue(null, newToken);

                if (!originalRequest.headers) {
                    originalRequest.headers = {};
                }
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                const errorObj =
                    err instanceof Error
                        ? err
                        : new Error("Authentication failed");
                processQueue(errorObj, null);
                localStorage.removeItem("accessToken");

                // Notify AuthContext about logout
                if (authLogoutCallback) {
                    authLogoutCallback();
                }

                return Promise.reject(errorObj);
            } finally {
                isRefreshing = false;
            }
        }

        const errorObj =
            error instanceof Error ? error : new Error("Request failed");
        return Promise.reject(errorObj);
    },
);

export default axiosInstance;
