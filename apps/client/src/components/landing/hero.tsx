import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Star, Zap, Search } from "lucide-react";
import { Button } from "../ui/button";

export function Hero() {
    return (
        <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
            <div className="relative z-10 container mx-auto px-4 py-16 md:py-20 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-6">
                    <Sparkles className="h-4 w-4" />
                    <span>Trusted by customers worldwide</span>
                </div>

                {/* Heading */}
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    Your Reliable Rental Partner
                </h1>

                {/* Subtext */}
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-300">
                    Find quality rentals for electronics, equipment, and more —
                    without the hassle.
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[
                        {
                            icon: <Zap className="h-6 w-6 text-blue-400" />,
                            title: "Fast Booking",
                            desc: "Reserve in just a few clicks.",
                        },
                        {
                            icon: <Shield className="h-6 w-6 text-blue-400" />,
                            title: "Secure",
                            desc: "Safe payments and trusted partners.",
                        },
                        {
                            icon: <Star className="h-6 w-6 text-blue-400" />,
                            title: "Quality Checked",
                            desc: "Only well-maintained rentals.",
                        },
                    ].map((f, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center p-5 rounded-xl bg-white/5 border border-white/10"
                        >
                            <div className="p-2 rounded-full bg-blue-500/20 mb-3">
                                {f.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                                {f.title}
                            </h3>
                            <p className="text-gray-400 text-center">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button
                        asChild
                        size="lg"
                        className="px-10 py-5 text-xl rounded-xl"
                    >
                        <Link
                            href="/register"
                            className="flex items-center gap-3"
                        >
                            Get Started
                            <ArrowRight className="h-7 w-7" />
                        </Link>
                    </Button>

                    <Button
                        asChild
                        size="lg"
                        className="px-10 py-5 text-xl rounded-xl"
                    >
                        <Link href="#" className="flex items-center gap-3">
                            Track Your Order
                            <Search className="h-7 w-7" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
