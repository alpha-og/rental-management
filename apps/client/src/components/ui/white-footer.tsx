import Link from "next/link";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export function WhiteFooter() {
    return (
        <footer className="bg-white border-t border-gray-200 text-gray-600">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left: Copyright */}
                    <div className="text-sm text-gray-500 order-3 md:order-1">
                        © {new Date().getFullYear()} Lumiere. All rights
                        reserved.
                    </div>

                    {/* Middle: Social Icons */}
                    <div className="flex justify-center space-x-4 order-1 md:order-2">
                        <Link
                            href="#"
                            className="hover:text-gray-900 transition-colors"
                        >
                            <Facebook size={18} />
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-gray-900 transition-colors"
                        >
                            <Twitter size={18} />
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-gray-900 transition-colors"
                        >
                            <Instagram size={18} />
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-gray-900 transition-colors"
                        >
                            <Github size={18} />
                        </Link>
                    </div>

                    {/* Right: Track your order */}
                    <Link
                        href="#"
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors order-2 md:order-3"
                    >
                        Track your order
                    </Link>
                </div>
            </div>
        </footer>
    );
}
