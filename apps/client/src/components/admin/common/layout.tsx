"use client";

import React, { useState, createContext, useContext } from "react";
import Sidebar from "./sidebar";
import MobileMenuButton from "./mobile-menu-button";
import { cn } from "@client/lib/utils";

interface AdminLayoutProps {
    children: React.ReactNode;
    defaultActiveTab?: string;
    className?: string;
}

interface MobileMenuContextType {
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
    MobileMenuButton: React.ComponentType<{ className?: string }>;
}

const MobileMenuContext = createContext<MobileMenuContextType | null>(null);

export const useMobileMenu = () => {
    const context = useContext(MobileMenuContext);
    if (!context) {
        throw new Error("useMobileMenu must be used within AdminLayout");
    }
    return context;
};

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

    const MobileMenuButtonComponent: React.FC<{ className?: string }> = ({
        className: buttonClassName,
    }) => (
        <MobileMenuButton
            isOpen={isMobileMenuOpen}
            onClick={toggleMobileMenu}
            className={buttonClassName}
        />
    );

    const contextValue: MobileMenuContextType = {
        isMobileMenuOpen,
        toggleMobileMenu,
        MobileMenuButton: MobileMenuButtonComponent,
    };

    return (
        <MobileMenuContext.Provider value={contextValue}>
            <div className={cn("min-h-screen bg-gray-50 flex", className)}>
                <Sidebar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    isMobileOpen={isMobileMenuOpen}
                    onMobileToggle={toggleMobileMenu}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                    <main className="flex-1 overflow-auto">{children}</main>
                </div>
            </div>
        </MobileMenuContext.Provider>
    );
};

export default AdminLayout;
