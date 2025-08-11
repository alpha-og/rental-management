import axiosInstance from "@client/lib/axios";
import { AxiosError } from "axios";

export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface LoginSuccessResponse {
    accessToken: string;
}

export interface ApiErrorShape {
    statusCode?: number;
    message: string | string[];
    error?: string;
    [key: string]: unknown;
}

export async function login(
    body: LoginRequestBody,
): Promise<LoginSuccessResponse> {
    try {
        const { data } = await axiosInstance.post<LoginSuccessResponse>(
            "/api/v1/auth/login",
            body,
        );
        return data;
    } catch (e) {
        if (e instanceof AxiosError && e.response?.data) {
            const errorData = e.response.data as ApiErrorShape;
            throw new Error(
                Array.isArray(errorData.message)
                    ? errorData.message.join(", ")
                    : errorData.message || "Login failed",
            );
        }
        throw new Error("Login failed");
    }
}

export async function logout(): Promise<void> {
    try {
        await axiosInstance.get("/api/v1/auth/logout");
    } catch (e) {
        if (e instanceof AxiosError && e.response?.data) {
            const errorData = e.response.data as ApiErrorShape;
            throw new Error(
                Array.isArray(errorData.message)
                    ? errorData.message.join(", ")
                    : errorData.message || "Logout failed",
            );
        }
        throw new Error("Logout failed");
    }
}
