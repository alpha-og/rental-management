import Link from "next/link";
import { ArrowRight, Shield, Star, Zap, Search } from "lucide-react";
import { Button } from "../ui/button";

export function Hero() {
    return (
        <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-20 md:py-28 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm mb-8 shadow-sm">
                    <span className="font-medium">
                        Where convenience meets trust
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                    Your Reliable
                    <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Rental Partner
                    </span>
                </h1>

                {/* Subtext */}
                <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-slate-600 leading-relaxed font-light">
                    Find quality rentals for electronics, equipment, and more —
                    <br className="hidden md:block" />
                    without the hassle.
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
                    {[
                        {
                            icon: <Zap className="h-6 w-6 text-indigo-600" />,
                            title: "Fast Booking",
                            desc: "Reserve in just a few clicks with our streamlined process.",
                        },
                        {
                            icon: (
                                <Shield className="h-6 w-6 text-indigo-600" />
                            ),
                            title: "Secure & Safe",
                            desc: "Protected payments and verified trusted partners.",
                        },
                        {
                            icon: <Star className="h-6 w-6 text-indigo-600" />,
                            title: "Quality Assured",
                            desc: "Only well-maintained, premium rental items.",
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="p-3 rounded-full bg-indigo-100 mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 text-center leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        asChild
                        size="lg"
                        className="px-12 py-6 text-lg rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <Link
                            href="/register"
                            className="flex items-center gap-3 font-semibold"
                        >
                            Get Started
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="px-12 py-6 text-lg rounded-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
                    >
                        <Link
                            href="#"
                            className="flex items-center gap-3 font-semibold"
                        >
                            Track Your Order
                            <Search className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
