"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    ChevronDown,
    Info,
    FileText,
    Package,
    BarChart3,
    X,
} from "lucide-react";
import { Input } from "@client/components/ui/input";
import { cn } from "@client/lib/utils";
import { useMobileMenu } from "@client/components/admin/common";
import {
    getDashboardData,
    type DashboardData,
} from "@client/app/admin/dashboard/api";

interface StatsCardProps {
    title: string;
    value: number;
    icon?: React.ReactNode;
    className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    className,
}) => (
    <div
        className={cn(
            "bg-white rounded-lg border p-4 sm:p-6 shadow-sm",
            className,
        )}
    >
        <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{title}</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
                    {value.toLocaleString()}
                </p>
            </div>
            {icon && (
                <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0 ml-3">
                    {icon}
                </div>
            )}
        </div>
    </div>
);

interface TableColumn {
    key: string;
    label: string;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface TableProps {
    title: string;
    data: Record<string, unknown>[];
    columns: TableColumn[];
    className?: string;
}

const Table: React.FC<TableProps> = ({ title, data, columns, className }) => (
    <div className={cn("bg-white rounded-lg border shadow-sm", className)}>
        <div className="p-3 sm:p-4 border-b">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
                {title}
            </h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full min-w-[300px]">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 border-b whitespace-nowrap"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-900 whitespace-nowrap"
                                >
                                    {column.render
                                        ? column.render(row[column.key], row)
                                        : typeof row[column.key] === "string" ||
                                            typeof row[column.key] === "number"
                                          ? String(row[column.key])
                                          : ""}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const PeriodSelector: React.FC<{
    value: string;
    onChange: (value: string) => void;
}> = ({ value, onChange }) => {
    const periods = [
        { value: "last-7-days", label: "Last 7 days" },
        { value: "last-30-days", label: "Last 30 days" },
        { value: "last-90-days", label: "Last 90 days" },
        { value: "last-year", label: "Last year" },
    ];

    return (
        <div className="relative w-full sm:w-auto">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto min-w-[160px]"
            >
                {periods.map((period) => (
                    <option key={period.value} value={period.value}>
                        {period.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
    );
};

export default function AdminDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState("last-30-days");
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { MobileMenuButton } = useMobileMenu();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log(
                    `Fetching dashboard data for period: ${selectedPeriod}`,
                );
                const data = await getDashboardData(selectedPeriod);
                setDashboardData(data);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                // Don't set error state, just log it since we have fallback data
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [selectedPeriod]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg text-gray-600 mb-2">
                        Loading dashboard...
                    </div>
                    <div className="text-sm text-gray-500">
                        Fetching data from backend API
                    </div>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg text-red-600 mb-2">
                        No data available
                    </div>
                    <div className="text-sm text-gray-500">
                        Please try refreshing the page
                    </div>
                </div>
            </div>
        );
    }

    const productCategoryColumns: TableColumn[] = [
        { key: "category", label: "Category" },
        { key: "ordered", label: "Ordered" },
        {
            key: "revenue",
            label: "Revenue",
            render: (value: unknown) => `$${Number(value).toLocaleString()}`,
        },
    ];

    const topProductColumns: TableColumn[] = [
        { key: "product", label: "Product" },
        { key: "ordered", label: "Ordered" },
        {
            key: "revenue",
            label: "Revenue",
            render: (value: unknown) => `$${Number(value).toLocaleString()}`,
        },
    ];

    const topCustomerColumns: TableColumn[] = [
        { key: "customer", label: "Customer" },
        { key: "ordered", label: "Ordered" },
        {
            key: "revenue",
            label: "Revenue",
            render: (value: unknown) => `$${Number(value).toLocaleString()}`,
        },
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <MobileMenuButton />
                        </div>
                        <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Dashboard
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4 sm:p-6">
                {/* Backend Status Banner */}
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-blue-800">
                        <Info className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">
                            <strong>Development Mode:</strong> Currently using
                            fallback data. Backend API endpoints are ready to be
                            implemented at{" "}
                            <code className="bg-blue-100 px-1 rounded text-xs">
                                localhost:3001/api/v1
                            </code>
                        </span>
                    </div>
                </div>

                {/* Search and Period Selector */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-10 w-full sm:w-72 lg:w-96"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="w-full sm:w-auto">
                        <PeriodSelector
                            value={selectedPeriod}
                            onChange={setSelectedPeriod}
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <StatsCard
                        title="Quotations"
                        value={dashboardData.stats.quotations}
                        icon={<FileText className="h-5 w-5 text-blue-600" />}
                    />
                    <StatsCard
                        title="Rentals"
                        value={dashboardData.stats.rentals}
                        icon={<Package className="h-5 w-5 text-green-600" />}
                    />
                    <StatsCard
                        title="Revenue"
                        value={dashboardData.stats.revenue}
                        icon={<BarChart3 className="h-5 w-5 text-purple-600" />}
                    />
                </div>

                {/* Data Tables */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                    <Table
                        title="Top Product Categories"
                        data={
                            dashboardData.topProductCategories as unknown as Record<
                                string,
                                unknown
                            >[]
                        }
                        columns={productCategoryColumns}
                    />
                    <Table
                        title="Top Products"
                        data={
                            dashboardData.topProducts as unknown as Record<
                                string,
                                unknown
                            >[]
                        }
                        columns={topProductColumns}
                    />
                    <Table
                        title="Top Customer"
                        data={
                            dashboardData.topCustomers as unknown as Record<
                                string,
                                unknown
                            >[]
                        }
                        columns={topCustomerColumns}
                        className="xl:col-span-2"
                    />
                </div>
            </main>
        </div>
    );
}
