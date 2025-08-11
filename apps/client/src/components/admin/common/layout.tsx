"use client";

import React, { useState, createContext, useContext } from "react";
import Sidebar from "./sidebar";
import MobileMenuButton from "./mobile-menu-button";
import { cn } from "@client/lib/utils";
import { usePathname } from "next/navigation";

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
    const pathname = usePathname();

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

    const pageTitle = (() => {
        if (!pathname) return "Dashboard";
        if (pathname.includes("/admin/dashboard")) return "Dashboard";
        if (pathname.includes("/admin/rental")) return "Rental";
        if (pathname.includes("/admin/order")) return "Order";
        if (pathname.includes("/admin/products")) return "Products";
        if (pathname.includes("/admin/reporting")) return "Reporting";
        if (pathname.includes("/admin/settings")) return "Settings";
        return "Dashboard";
    })();

    const hideHeader = pathname?.includes("/admin/settings");

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
                <div className="flex-1 flex flex-col min-w-0 w-full md:w-auto">
                    {/* Global Header across admin pages (hidden on Settings) */}
                    {!hideHeader && (
                        <header className="bg-white border-b px-4 sm:px-6 py-6.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="md:hidden">
                                        <MobileMenuButton
                                            isOpen={isMobileMenuOpen}
                                            onClick={toggleMobileMenu}
                                        />
                                    </div>
                                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                                        {pageTitle}
                                    </h1>
                                </div>
                                <div />
                            </div>
                        </header>
                    )}

                    <main className="flex-1 overflow-x-hidden overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </MobileMenuContext.Provider>
    );
};

export default AdminLayout;
