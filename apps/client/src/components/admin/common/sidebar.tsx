"use client";

import React, { useState, useEffect } from "react";
import {
    Home,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    User,
    X,
    ChevronLeft,
    LogOut,
} from "lucide-react";
import { cn } from "@client/lib/utils";

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    href?: string;
}

interface SidebarProps {
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    className?: string;
    isMobileOpen?: boolean;
    onMobileToggle?: () => void;
}

const sidebarItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { id: "rental", label: "Rental", icon: <Package className="h-5 w-5" /> },
    { id: "order", label: "Order", icon: <ShoppingCart className="h-5 w-5" /> },
    {
        id: "products",
        label: "Products",
        icon: <Package className="h-5 w-5" />,
    },
    {
        id: "reporting",
        label: "Reporting",
        icon: <BarChart3 className="h-5 w-5" />,
    },
    {
        id: "settings",
        label: "Settings",
        icon: <Settings className="h-5 w-5" />,
    },
];

interface SidebarItemComponentProps {
    item: SidebarItem;
    isActive: boolean;
    isCollapsed: boolean;
    onClick: () => void;
}

const SidebarItemComponent: React.FC<SidebarItemComponentProps> = ({
    item,
    isActive,
    isCollapsed,
    onClick,
}) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
            "hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            isActive
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "text-gray-700 hover:text-gray-900",
            isCollapsed && "justify-center px-2",
        )}
        title={isCollapsed ? item.label : undefined}
    >
        <span className={cn("flex-shrink-0", isActive && "text-white")}>
            {item.icon}
        </span>
        {!isCollapsed && <span className="truncate">{item.label}</span>}
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({
    activeTab = "dashboard",
    onTabChange,
    className,
    isMobileOpen: externalMobileOpen,
    onMobileToggle,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [internalMobileOpen, setInternalMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Use external mobile state if provided, otherwise use internal state
    const isMobileOpen =
        externalMobileOpen !== undefined
            ? externalMobileOpen
            : internalMobileOpen;
    const setIsMobileOpen = onMobileToggle || setInternalMobileOpen;

    // Check if screen is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMobileOpen(false);
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Handle escape key to close mobile sidebar
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isMobileOpen) {
                setIsMobileOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isMobileOpen]);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (isMobile && isMobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobile, isMobileOpen]);

    const handleItemClick = (itemId: string) => {
        onTabChange?.(itemId);
        if (isMobile) {
            setIsMobileOpen(false);
        }
    };

    const sidebarContent = (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div
                className={cn(
                    "flex items-center gap-3 px-4 py-6 border-b border-gray-200",
                    isCollapsed && !isMobile && "px-2 justify-center",
                )}
            >
                {(!isCollapsed || isMobile) && (
                    <>
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Home className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg font-semibold text-gray-900 truncate">
                                Hello, Adam!
                            </h1>
                        </div>
                    </>
                )}

                {/* Desktop collapse button */}
                {!isMobile && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                        title={
                            isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                        }
                    >
                        <ChevronLeft
                            className={cn(
                                "h-4 w-4 text-gray-500 transition-transform duration-200",
                                isCollapsed && "rotate-180",
                            )}
                        />
                    </button>
                )}

                {/* Mobile close button */}
                {isMobile && (
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => (
                    <SidebarItemComponent
                        key={item.id}
                        item={item}
                        isActive={activeTab === item.id}
                        isCollapsed={isCollapsed && !isMobile}
                        onClick={() => handleItemClick(item.id)}
                    />
                ))}
            </nav>

            {/* User Profile */}
            <div
                className={cn(
                    "border-t border-gray-200 p-4",
                    isCollapsed && !isMobile && "px-2",
                )}
            >
                <div
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
                        isCollapsed && !isMobile && "justify-center px-2",
                    )}
                    tabIndex={0}
                    role="button"
                >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600" />
                    </div>
                    {(!isCollapsed || isMobile) && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                Adam
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                Administrator
                            </p>
                        </div>
                    )}
                </div>

                {(!isCollapsed || isMobile) && (
                    <button className="w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1">
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
                    // Desktop styles
                    "hidden md:flex md:flex-col md:sticky md:top-0 md:h-screen",
                    isCollapsed ? "md:w-16" : "md:w-64",
                    className,
                )}
            >
                {sidebarContent}
            </aside>

            {/* Mobile sidebar - opens from right */}
            {isMobile && (
                <aside
                    className={cn(
                        "fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out md:hidden h-screen",
                        isMobileOpen ? "translate-x-0" : "translate-x-full",
                    )}
                >
                    {sidebarContent}
                </aside>
            )}
        </>
    );
};

export default Sidebar;
