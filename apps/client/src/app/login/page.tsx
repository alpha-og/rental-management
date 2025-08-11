"use client";

import { useState } from "react";
import { login } from "./api";
import { useRouter } from "next/navigation";
import { Button } from "@client/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@client/components/login/page";
import { Input } from "@client/components/ui/input";
import { Label } from "@client/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleForgotPassword = () => {
        // TODO: Implement forgot password functionality
        alert("Forgot password functionality will be implemented soon!");
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);
        const formData = new FormData(event.currentTarget);
        const rawEmail = formData.get("email");
        const rawPassword = formData.get("password");
        const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
        const password = typeof rawPassword === "string" ? rawPassword : "";
        if (!email || !password) return;
        setLoading(true);
        try {
            const data = await login({ email, password });
            setSuccess(true);
            localStorage.setItem("accessToken", data.accessToken);
            router.push("admin/dashboard");
        } catch (e) {
            const message =
                typeof e === "object" && e && "message" in e
                    ? (e as { message?: unknown }).message
                    : "Login failed";
            setError(String(message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <form
                    onSubmit={(e) => {
                        void handleSubmit(e);
                    }}
                >
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">
                            Login
                        </CardTitle>
                        <CardDescription>
                            Sign in to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-0 right-0"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full space-y-2">
                            {error && (
                                <p
                                    className="text-sm text-red-600"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            )}
                            {success && !error && (
                                <p className="text-sm text-green-600">
                                    Logged in.
                                </p>
                            )}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                            <div className="text-center text-sm text-gray-600">
                                Don&apos;t have an account?{" "}
                                <a
                                    href="/register"
                                    className="text-blue-500 hover:underline font-medium"
                                >
                                    Register here
                                </a>
                            </div>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
