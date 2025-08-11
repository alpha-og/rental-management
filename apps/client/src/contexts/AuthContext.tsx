"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
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
    accessToken: string;
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

    const checkAuth = useCallback(() => {
        try {
            // Check if we have a stored token
            const token = localStorage.getItem("accessToken");

            // Development mode: provide mock user for admin pages if no token
            const isDevelopment = process.env.NODE_ENV === "development";
            const isAdminRoute = pathname?.startsWith("/admin");

            if (!token) {
                if (isDevelopment && isAdminRoute) {
                    // Provide mock user for admin development
                    setUser({
                        id: "dev-admin-id",
                        name: "Admin User (Dev)",
                        email: "admin@dev.local",
                        role: "admin",
                    });
                    console.info(
                        "🔧 Development mode: Using mock admin user for admin routes",
                    );
                } else {
                    setUser(null);
                }
                setLoading(false);
                return;
            }

            // For now, we'll just check if the token exists
            // You should replace this with an actual /auth/me endpoint call when available
            // const response = await axiosInstance.get('/api/v1/auth/me');
            // setUser(response.data);

            // Temporary: assume user is valid if token exists
            setUser({
                id: "temp-user-id",
                name: "Adam",
                email: "adam@example.com",
                role: "admin",
            });
        } catch (error) {
            console.log("Auth check failed:", error);
            setUser(null);
            localStorage.removeItem("accessToken");
        } finally {
            setLoading(false);
        }
    }, [pathname]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Redirect logic
    useEffect(() => {
        if (!loading) {
            const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
            const isDevelopment = process.env.NODE_ENV === "development";
            const isAdminRoute = pathname?.startsWith("/admin");

            if (!user && !isPublicRoute) {
                // In development mode, don't redirect admin routes (mock user will be provided)
                if (isDevelopment && isAdminRoute) {
                    return;
                }
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
            const response = await axiosInstance.post<AuthResponse>(
                "/api/v1/auth/login",
                {
                    email,
                    password,
                },
            );

            if (response.data.accessToken) {
                localStorage.setItem("accessToken", response.data.accessToken);

                // Set user data - you might want to fetch this from another endpoint
                setUser({
                    id: "temp-user-id",
                    name: "Adam",
                    email: email,
                    role: "admin",
                });

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
            await axiosInstance.get("/api/v1/auth/logout");
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
