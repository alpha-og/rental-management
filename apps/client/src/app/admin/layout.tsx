"use client";

import { AuthProvider } from "@client/contexts/AuthContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthProvider>{children}</AuthProvider>;
}
