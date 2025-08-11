"use client";

import React from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@client/lib/utils";

interface MobileMenuButtonProps {
    isOpen: boolean;
    onClick: () => void;
    className?: string;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
    isOpen,
    onClick,
    className,
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-2 rounded-lg bg-white border border-gray-200 shadow-sm transition-all duration-200",
                "hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
                "md:hidden",
                className,
            )}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
            <div className="relative w-5 h-5">
                {/* Menu Icon */}
                <Menu
                    className={cn(
                        "absolute inset-0 h-5 w-5 text-gray-600 transition-all duration-200",
                        isOpen
                            ? "opacity-0 rotate-90 scale-0"
                            : "opacity-100 rotate-0 scale-100",
                    )}
                />
                {/* X Icon */}
                <X
                    className={cn(
                        "absolute inset-0 h-5 w-5 text-gray-600 transition-all duration-200",
                        isOpen
                            ? "opacity-100 rotate-0 scale-100"
                            : "opacity-0 -rotate-90 scale-0",
                    )}
                />
            </div>
        </button>
    );
};

export default MobileMenuButton;
