import axios, { AxiosError } from "axios";

// Adjustable base URL: if NEXT_PUBLIC_API_BASE is defined use it, otherwise default to same-origin
const baseURL = process.env.NEXT_PUBLIC_API_BASE || "";

export const api = axios.create({
    baseURL,
    withCredentials: true, // allow cookies for auth session
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface LoginSuccessResponse {
    // adjust types once backend shape is known
    accessToken?: string;
    refreshToken?: string;
    user?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    [key: string]: unknown;
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
        const { data } = await api.post<LoginSuccessResponse>(
            "/api/v1/auth/login",
            body,
        );
        return data;
    } catch (err) {
        throw toApiError(err);
    }
}

export async function logout(): Promise<void> {
    try {
        await api.post("/api/v1/auth/logout");
    } catch (err) {
        throw toApiError(err);
    }
}

function toApiError(err: unknown): Error {
    if (axios.isAxiosError(err)) {
        const apiErr = buildErrorFromAxios(err);
        return apiErr;
    }
    return new Error("Unknown error");
}

function buildErrorFromAxios(err: AxiosError): Error {
    const statusCode = err.response?.status;
    const data: unknown = err.response?.data;
    if (data && typeof data === "object") {
        const message = (data as { message?: unknown }).message;
        return new Error(
            typeof message === "string" && message.length > 0
                ? message
                : err.message ||
                  `Request failed${statusCode ? ` (${statusCode})` : ""}`,
        );
    }
    return new Error(err.message || "Request failed");
}
