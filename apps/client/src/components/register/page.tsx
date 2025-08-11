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
} from "../login/page";
import { Input } from "@client/components/ui/input";
import { Label } from "@client/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface PasswordStrength {
    score: number;
    label: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong";
    color: string;
}

const analyzePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1; // lowercase
    if (/[A-Z]/.test(password)) score += 1; // uppercase
    if (/[0-9]/.test(password)) score += 1; // numbers
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // special characters

    // Bonus for very long passwords
    if (password.length >= 16) score += 1;

    if (score <= 2) return { score, label: "Very Weak", color: "text-red-600" };
    if (score <= 3) return { score, label: "Weak", color: "text-orange-500" };
    if (score <= 4) return { score, label: "Fair", color: "text-yellow-500" };
    if (score <= 5) return { score, label: "Good", color: "text-blue-500" };
    return { score, label: "Strong", color: "text-green-600" };
};

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordStrength = analyzePasswordStrength(password);
    const passwordsMatch =
        password === confirmPassword && confirmPassword.length > 0;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        const formData = new FormData(e.currentTarget);
        const rawName = formData.get("name");
        const rawEmail = formData.get("email");
        const rawPhone = formData.get("phone");
        const rawPassword = formData.get("password");
        const rawConfirm = formData.get("confirmPassword");

        const name = typeof rawName === "string" ? rawName.trim() : "";
        const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
        const phone = typeof rawPhone === "string" ? rawPhone.trim() : "";
        const password = typeof rawPassword === "string" ? rawPassword : "";
        const confirmPassword =
            typeof rawConfirm === "string" ? rawConfirm : "";

        if (!name || !email || !phone || !password || !confirmPassword) return;

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Check password strength (optional - you can require minimum strength)
        const strength = analyzePasswordStrength(password);
        if (strength.score < 3) {
            setError("Password is too weak. Please use a stronger password.");
            return;
        }

        setLoading(true);
        try {
            await register({ name, email, phone, password, confirmPassword });
            setSuccess(true);
            e.currentTarget.reset();
            setPassword("");
            setConfirmPassword("");
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
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
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
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="1234567890"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </Button>
                                </div>
                                {password.length > 0 && (
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span>Password strength:</span>
                                            <span
                                                className={
                                                    passwordStrength.color
                                                }
                                            >
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1">
                                            <div
                                                className={`h-1 rounded-full transition-all duration-300 ${
                                                    passwordStrength.score <= 2
                                                        ? "bg-red-500"
                                                        : passwordStrength.score <=
                                                            3
                                                          ? "bg-orange-500"
                                                          : passwordStrength.score <=
                                                              4
                                                            ? "bg-yellow-500"
                                                            : passwordStrength.score <=
                                                                5
                                                              ? "bg-blue-500"
                                                              : "bg-green-500"
                                                }`}
                                                style={{
                                                    width: `${Math.min((passwordStrength.score / 6) * 100, 100)}%`,
                                                }}
                                            />
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-1">
                                            <div>Password requirements:</div>
                                            <ul className="space-y-0.5 ml-2">
                                                <li
                                                    className={
                                                        password.length >= 8
                                                            ? "text-green-600"
                                                            : "text-gray-400"
                                                    }
                                                >
                                                    ✓ At least 8 characters
                                                </li>
                                                <li
                                                    className={
                                                        /[a-z]/.test(password)
                                                            ? "text-green-600"
                                                            : "text-gray-400"
                                                    }
                                                >
                                                    ✓ Lowercase letter
                                                </li>
                                                <li
                                                    className={
                                                        /[A-Z]/.test(password)
                                                            ? "text-green-600"
                                                            : "text-gray-400"
                                                    }
                                                >
                                                    ✓ Uppercase letter
                                                </li>
                                                <li
                                                    className={
                                                        /[0-9]/.test(password)
                                                            ? "text-green-600"
                                                            : "text-gray-400"
                                                    }
                                                >
                                                    ✓ Number
                                                </li>
                                                <li
                                                    className={
                                                        /[^A-Za-z0-9]/.test(
                                                            password,
                                                        )
                                                            ? "text-green-600"
                                                            : "text-gray-400"
                                                    }
                                                >
                                                    ✓ Special character
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </Button>
                                </div>
                                {confirmPassword.length > 0 && (
                                    <div className="text-xs">
                                        {passwordsMatch ? (
                                            <span className="text-green-600">
                                                ✓ Passwords match
                                            </span>
                                        ) : (
                                            <span className="text-red-600">
                                                ✗ Passwords do not match
                                            </span>
                                        )}
                                    </div>
                                )}
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
