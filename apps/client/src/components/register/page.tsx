"use client";

import { useState } from "react";
import { register } from "@client/app/register/api";
import { Button } from "@client/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@client/components/login/card";
import { Input } from "@client/components/ui/input";
import { Label } from "@client/components/ui/label";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        const formData = new FormData(e.currentTarget);
        const rawEmail = formData.get("email");
        const rawPassword = formData.get("password");
        const rawConfirm = formData.get("confirmPassword");
        const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
        const password = typeof rawPassword === "string" ? rawPassword : "";
        const confirmPassword =
            typeof rawConfirm === "string" ? rawConfirm : "";
        if (!email || !password || !confirmPassword) return;
        setLoading(true);
        try {
            await register({ email, password, confirmPassword });
            setSuccess(true);
            e.currentTarget.reset();
        } catch (err) {
            const msg =
                typeof err === "object" && err && "message" in err
                    ? (err as { message?: unknown }).message
                    : "Registration failed";
            setError(String(msg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <form
                    onSubmit={(ev) => {
                        void handleSubmit(ev);
                    }}
                >
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">
                            Create account
                        </CardTitle>
                        <CardDescription>
                            Register a new account
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
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                />
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
                                    Registered successfully.
                                </p>
                            )}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Registering..." : "Register"}
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
