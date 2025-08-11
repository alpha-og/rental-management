import Link from "next/link";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 relative">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between relative">
                    {/* Left: Copyright */}
                    <div className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Lumiere. All rights
                        reserved.
                    </div>

                    {/* Middle: Social Icons (centered absolutely) */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex space-x-4">
                        <Link
                            href="#"
                            className="hover:text-indigo-600 transition-colors"
                        >
                            <Facebook size={18} />
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-indigo-600 transition-colors"
                        >
                            <Twitter size={18} />
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-indigo-600 transition-colors"
                        >
                            <Instagram size={18} />
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-indigo-600 transition-colors"
                        >
                            <Github size={18} />
                        </Link>
                    </div>

                    {/* Right: Track your order */}
                    <Link
                        href="#"
                        className="text-sm text-indigo-600 hover:text-purple-600 transition-colors"
                    >
                        Track your order
                    </Link>
                </div>
            </div>
        </footer>
    );
}
