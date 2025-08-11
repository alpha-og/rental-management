import axiosInstance from "@client/lib/axios";

export interface RegisterRequestBody {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterSuccessResponse {
    accessToken: string;
}

export async function register(
    body: RegisterRequestBody,
): Promise<RegisterSuccessResponse> {
    const { confirmPassword, ...payload } = body;
    if (body.password !== confirmPassword) {
        throw new Error("Passwords do not match");
    }
    try {
        const { data } = await axiosInstance.post<RegisterSuccessResponse>(
            "/api/v1/auth/register",
            payload,
        );
        return data;
    } catch (e) {
        if (e instanceof Error) throw e;
        throw new Error("Registration failed");
    }
}
