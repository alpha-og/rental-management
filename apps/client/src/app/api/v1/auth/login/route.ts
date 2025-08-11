import { NextResponse } from "next/server";

type LoginBody = { email?: string; password?: string };

export async function POST(request: Request) {
    try {
        const raw = (await request.json().catch(() => undefined)) as unknown;
        if (!raw || typeof raw !== "object") {
            return NextResponse.json(
                { message: "invalid JSON body" },
                { status: 400 },
            );
        }
        const { email, password } = raw as LoginBody;
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email ||
            !password
        ) {
            return NextResponse.json(
                { message: "email and password required" },
                { status: 400 },
            );
        }
        return NextResponse.json({
            message: "Logged in (stub)",
            user: { email },
            accessToken: "dev-token",
        });
    } catch {
        return NextResponse.json({ message: "Login failed" }, { status: 500 });
    }
}
