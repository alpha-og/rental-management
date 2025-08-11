import Link from "next/link";
import { Button } from "./button";
import { Home, ShoppingCart, Heart, User } from "lucide-react";

export function Navbar() {
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

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-4">
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

                        <Button asChild variant="ghost">
                            <Link href="/login">Login</Link>
                        </Button>

                        <Button asChild>
                            <Link href="/register">Register</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
