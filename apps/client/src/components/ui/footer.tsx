import Link from "next/link";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-gray-400">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left: Copyright */}
                    <div className="text-sm text-gray-500 order-3 md:order-1">
                        © {new Date().getFullYear()} Lumiere. All rights
                        reserved.
                    </div>

                    {/* Middle: Social Icons */}
                    <div className="flex space-x-4 order-1 md:order-2">
                        <Link
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            <Facebook size={18} />
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            <Twitter size={18} />
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            <Instagram size={18} />
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            <Github size={18} />
                        </Link>
                    </div>

                    {/* Right: Track your order */}
                    <Link
                        href="#"
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors order-2 md:order-3"
                    >
                        Track your order
                    </Link>
                </div>
            </div>
        </footer>
    );
}
