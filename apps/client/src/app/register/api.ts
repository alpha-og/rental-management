import { api } from "../login/api";

export interface RegisterRequestBody {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterSuccessResponse {
    user?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    message?: string;
    [key: string]: unknown;
}

export async function register(
    body: RegisterRequestBody,
): Promise<RegisterSuccessResponse> {
    const { confirmPassword, ...payload } = body;
    if (body.password !== confirmPassword) {
        throw new Error("Passwords do not match");
    }
    try {
        const { data } = await api.post<RegisterSuccessResponse>(
            "/api/v1/auth/register",
            payload,
        );
        return data;
    } catch (e) {
        if (e instanceof Error) throw e;
        throw new Error("Registration failed");
    }
}
