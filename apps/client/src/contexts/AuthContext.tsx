"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axiosInstance, { setAuthLogoutCallback } from "@client/lib/axios";

interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    profileCompleted?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setAuthUser: (user: User | null) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/signup", "/"];

interface AuthResponse {
    ok: boolean;
    data: User;
    accessToken?: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Set up logout callback for axios interceptor
        const handleAuthLogout = () => {
            setUser(null);
            router.push("/login");
        };

        setAuthLogoutCallback(handleAuthLogout);
    }, [router]);

    const checkAuth = async () => {
        try {
            const response = await axiosInstance.get<AuthResponse>(
                "https://server.pgbee.in/auth/login",
                {
                    withCredentials: true,
                },
            );

            if (response.data.ok) {
                setUser(response.data.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.log("Auth check failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void checkAuth();
    }, []);

    // Redirect logic
    useEffect(() => {
        if (!loading) {
            const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

            if (!user && !isPublicRoute) {
                // User is not authenticated and trying to access protected route
                router.push("/login");
            } else if (
                user &&
                (pathname === "/login" || pathname === "/signup")
            ) {
                // User is authenticated but on login/signup page
                router.push("/userDashboard");
            }
        }
    }, [user, loading, pathname, router]);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const response = await axiosInstance.post<AuthResponse>(
                "https://server.pgbee.in/auth/login",
                {
                    email,
                    password,
                },
                {
                    withCredentials: true,
                },
            );

            if (response.data.ok) {
                setUser(response.data.data);

                // Store token if available
                if (response.data.accessToken) {
                    localStorage.setItem(
                        "accessToken",
                        response.data.accessToken,
                    );
                }

                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post(
                "https://server.pgbee.in/auth/logout",
                {},
                {
                    withCredentials: true,
                },
            );
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            localStorage.removeItem("accessToken");
            router.push("/login");
        }
    };

    const setAuthUser = (userData: User | null) => {
        setUser(userData);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        setAuthUser,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
