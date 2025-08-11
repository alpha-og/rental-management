"use client";

import Link from "next/link";
import { Button } from "./button";
import {
    Home,
    ShoppingCart,
    Heart,
    User,
    Menu as MenuIcon,
    X as XIcon,
} from "lucide-react";
import { useState } from "react";

interface NavbarProps {
    hideAuthButtons?: boolean;
}

export function Navbar({ hideAuthButtons }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Brand Logo / Title */}
                    <div className="flex items-center">
                        <Link
                            href="/landing"
                            className="text-2xl font-bold text-gray-800"
                        >
                            Rental Management
                        </Link>
                    </div>
                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
                        </Button>
                    </div>
                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button asChild variant="ghost">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" /> Home
                            </Link>
                        </Button>
                        <Button asChild variant="ghost">
                            <Link href="/cart">
                                <ShoppingCart className="mr-2 h-4 w-4" /> Cart
                            </Link>
                        </Button>
                        <Button asChild variant="ghost">
                            <Link href="/wishlist">
                                <Heart className="mr-2 h-4 w-4" /> Wishlist
                            </Link>
                        </Button>
                        <Button asChild variant="ghost">
                            <Link href="/user">
                                <User className="mr-2 h-4 w-4" /> User Info
                            </Link>
                        </Button>
                        {!hideAuthButtons && (
                            <>
                                <Button asChild variant="ghost">
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/register">Register</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg pb-4">
                    <div className="flex flex-col items-center space-y-2 px-4">
                        <Button asChild variant="ghost" className="w-full">
                            <Link
                                href="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Home className="mr-2 h-4 w-4" /> Home
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full">
                            <Link
                                href="/cart"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" /> Cart
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full">
                            <Link
                                href="/wishlist"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Heart className="mr-2 h-4 w-4" /> Wishlist
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full">
                            <Link
                                href="/user"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <User className="mr-2 h-4 w-4" /> User Info
                            </Link>
                        </Button>
                        {!hideAuthButtons && (
                            <>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="w-full"
                                >
                                    <Link
                                        href="/login"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        Login
                                    </Link>
                                </Button>
                                <Button asChild className="w-full">
                                    <Link
                                        href="/register"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        Register
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
