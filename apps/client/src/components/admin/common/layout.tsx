"use client";

import React, { useState } from "react";
import Sidebar from "./sidebar";
import MobileMenuButton from "./mobile-menu-button";
import { cn } from "@client/lib/utils";

interface AdminLayoutProps {
    children: React.ReactNode;
    defaultActiveTab?: string;
    className?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
    children,
    defaultActiveTab = "dashboard",
    className,
}) => {
    const [activeTab, setActiveTab] = useState(defaultActiveTab);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className={cn("min-h-screen bg-gray-50 flex", className)}>
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isMobileOpen={isMobileMenuOpen}
                onMobileToggle={toggleMobileMenu}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                {/* Content */}
                <main className="flex-1 overflow-auto">
                    {/* Mobile Menu Button - positioned in top right of content area */}
                    <div className="fixed top-4 right-6 z-30 md:hidden">
                        <MobileMenuButton
                            isOpen={isMobileMenuOpen}
                            onClick={toggleMobileMenu}
                        />
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
