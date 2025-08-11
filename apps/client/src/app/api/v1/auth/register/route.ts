import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const raw = (await request.json().catch(() => undefined)) as unknown;
        if (!raw || typeof raw !== "object") {
            return NextResponse.json(
                { message: "invalid JSON body" },
                { status: 400 },
            );
        }
        const { email, password, confirmPassword } = raw as {
            email?: string;
            password?: string;
            confirmPassword?: string;
        };
        if (!email || !password || !confirmPassword) {
            return NextResponse.json(
                { message: "email, password, confirmPassword required" },
                { status: 400 },
            );
        }
        if (password !== confirmPassword) {
            return NextResponse.json(
                { message: "passwords do not match" },
                { status: 400 },
            );
        }
        // TODO: integrate with backend auth service
        return NextResponse.json(
            { message: "Registered (stub)", user: { email } },
            { status: 201 },
        );
    } catch (e) {
        console.error("Register route error", e);
        return NextResponse.json(
            { message: "Registration failed", error: (e as Error)?.message },
            { status: 500 },
        );
    }
}
