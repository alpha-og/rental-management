import { NextResponse } from "next/server";

export function POST() {
    // TODO: clear auth session / cookies when real auth is added
    return NextResponse.json({ message: "Logged out (stub)" });
}
