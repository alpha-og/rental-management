"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@client/components/ui/button";
import { Input } from "@client/components/ui/input";
import {
    Search,
    TrendingUp,
    TrendingDown,
    Download,
    Filter,
    Calendar,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    BarChart3,
    X,
} from "lucide-react";
import {
    getReportingData,
    exportReport,
    type ReportingData,
    type RevenueData,
    type CategoryData,
} from "@client/app/admin/reporting/api";

// Chart Components (Simple implementations since we can't use external chart libraries)
const BarChart = ({ data, title }: { data: RevenueData[]; title: string }) => {
    const maxRevenue = Math.max(...data.map((d) => d.revenue));

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex items-end justify-between h-64 p-4 bg-gray-50 rounded-lg">
                {data.slice(-6).map((item) => (
                    <div
                        key={item.period}
                        className="flex flex-col items-center space-y-2"
                    >
                        <div className="text-xs text-gray-600">
                            ${(item.revenue / 1000).toFixed(0)}k
                        </div>
                        <div
                            className="bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 w-8"
                            style={{
                                height: `${(item.revenue / maxRevenue) * 200}px`,
                                minHeight: "4px",
                            }}
                        />
                        <div className="text-xs text-gray-700 font-medium">
                            {item.period}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PieChartComponent = ({
    data,
    title,
}: {
    data: CategoryData[];
    title: string;
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                    {/* Simple pie chart representation using borders */}
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-red-500 to-purple-500" />
                    <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                $
                                {(
                                    data.reduce(
                                        (sum, item) => sum + item.revenue,
                                        0,
                                    ) / 1000
                                ).toFixed(0)}
                                k
                            </div>
                            <div className="text-sm text-gray-600">Total</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                {data.map((item) => (
                    <div
                        key={item.category}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-gray-700">
                                {item.category}
                            </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                            {item.percentage}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Metric Card Component
const MetricCard = ({
    title,
    value,
    change,
    icon,
    prefix = "",
}: {
    title: string;
    value: number;
    change: number;
    icon: React.ReactNode;
    prefix?: string;
}) => {
    const isPositive = change >= 0;

    return (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {prefix}
                        {value.toLocaleString()}
                    </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">{icon}</div>
            </div>
            <div className="mt-4 flex items-center">
                {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                    className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
                >
                    {Math.abs(change)}%
                </span>
                <span className="text-sm text-gray-600 ml-1">
                    vs last period
                </span>
            </div>
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "active":
                return { color: "bg-green-100 text-green-800", text: "Active" };
            case "inactive":
                return { color: "bg-gray-100 text-gray-800", text: "Inactive" };
            case "available":
                return {
                    color: "bg-green-100 text-green-800",
                    text: "Available",
                };
            case "rented":
                return { color: "bg-blue-100 text-blue-800", text: "Rented" };
            case "maintenance":
                return {
                    color: "bg-yellow-100 text-yellow-800",
                    text: "Maintenance",
                };
            default:
                return { color: "bg-gray-100 text-gray-800", text: status };
        }
    };

    const config = getStatusConfig(status);
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
        >
            {config.text}
        </span>
    );
};

// Main Reporting Page Component
const ReportingPage = () => {
    const [reportingData, setReportingData] = useState<ReportingData | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState<
        "7d" | "30d" | "90d" | "1y"
    >("30d");
    const [activeTab, setActiveTab] = useState<
        "overview" | "products" | "customers"
    >("overview");

    // Load data on component mount and period change
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getReportingData(selectedPeriod);
            setReportingData(data);
        } catch (error) {
            console.error("Failed to load reporting data:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedPeriod]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const handleExportReport = async (
        type: "revenue" | "products" | "customers" | "full",
    ) => {
        try {
            const blob = await exportReport(type, "csv");
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${type}_report_${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export report:", error);
            alert("Failed to export report. Please try again.");
        }
    };

    const filteredProducts =
        reportingData?.productPerformance.filter((product) =>
            product.productName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
        ) || [];

    const filteredCustomers =
        reportingData?.topCustomers.filter((customer) =>
            customer.customerName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
        ) || [];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">Loading analytics...</div>
            </div>
        );
    }

    if (!reportingData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">
                    Failed to load reporting data
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Reporting & Analytics
                    </h1>
                    <p className="text-gray-600">
                        Track performance and analyze business metrics
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => void handleExportReport("full")}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                        Period:
                    </span>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    {[
                        { value: "7d", label: "7 Days" },
                        { value: "30d", label: "30 Days" },
                        { value: "90d", label: "90 Days" },
                        { value: "1y", label: "1 Year" },
                    ].map((period) => (
                        <button
                            key={period.value}
                            onClick={() =>
                                setSelectedPeriod(
                                    period.value as typeof selectedPeriod,
                                )
                            }
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                selectedPeriod === period.value
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={reportingData.overview.totalRevenue}
                    change={reportingData.overview.revenueGrowth}
                    icon={<DollarSign className="w-6 h-6 text-blue-600" />}
                    prefix="$"
                />
                <MetricCard
                    title="Total Orders"
                    value={reportingData.overview.totalOrders}
                    change={reportingData.overview.ordersGrowth}
                    icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
                />
                <MetricCard
                    title="Total Customers"
                    value={reportingData.overview.totalCustomers}
                    change={reportingData.overview.customersGrowth}
                    icon={<Users className="w-6 h-6 text-blue-600" />}
                />
                <MetricCard
                    title="Total Products"
                    value={reportingData.overview.totalProducts}
                    change={reportingData.overview.productsGrowth}
                    icon={<Package className="w-6 h-6 text-blue-600" />}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <BarChart
                        data={reportingData.revenueChart}
                        title="Revenue Trend"
                    />
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <PieChartComponent
                        data={reportingData.categoryBreakdown}
                        title="Revenue by Category"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "overview"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <BarChart3 className="h-4 w-4 inline mr-2" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "products"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <Package className="h-4 w-4 inline mr-2" />
                        Product Performance
                    </button>
                    <button
                        onClick={() => setActiveTab("customers")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "customers"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <Users className="h-4 w-4 inline mr-2" />
                        Top Customers
                    </button>
                </nav>
            </div>

            {/* Search Bar (for products and customers tabs) */}
            {(activeTab === "products" || activeTab === "customers") && (
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-10"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => void handleExportReport(activeTab)}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            )}

            {/* Tab Content */}
            {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Period Comparison */}
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Period Comparison
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    Current Period
                                </span>
                                <span className="font-semibold">
                                    $
                                    {reportingData.periodComparison.current.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    Previous Period
                                </span>
                                <span className="font-semibold">
                                    $
                                    {reportingData.periodComparison.previous.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm text-gray-600">
                                    Change
                                </span>
                                <div className="flex items-center">
                                    {reportingData.periodComparison.change >=
                                    0 ? (
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                    )}
                                    <span
                                        className={`font-semibold ${
                                            reportingData.periodComparison
                                                .change >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {Math.abs(
                                            reportingData.periodComparison
                                                .change,
                                        )}
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Metrics */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg border shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Key Insights
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    $
                                    {(
                                        reportingData.overview.totalRevenue /
                                        reportingData.overview.totalOrders
                                    ).toFixed(0)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Avg Order Value
                                </div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {(
                                        reportingData.overview.totalRevenue /
                                        reportingData.overview.totalCustomers
                                    ).toFixed(0)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Revenue per Customer
                                </div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                    {(
                                        reportingData.overview.totalOrders /
                                        reportingData.overview.totalCustomers
                                    ).toFixed(1)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Orders per Customer
                                </div>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">
                                    {(
                                        ((reportingData.overview.totalProducts -
                                            reportingData.productPerformance.filter(
                                                (p) =>
                                                    p.availability === "rented",
                                            ).length) /
                                            reportingData.overview
                                                .totalProducts) *
                                        100
                                    ).toFixed(0)}
                                    %
                                </div>
                                <div className="text-sm text-gray-600">
                                    Product Availability
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "products" && (
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Revenue
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Orders
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Avg Order Value
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <tr
                                        key={product.productId}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.productName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {product.productId}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            $
                                            {product.totalRevenue.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.totalOrders}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            $
                                            {product.averageOrderValue.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge
                                                status={product.availability}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "customers" && (
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Revenue
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Orders
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Order
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.customerId}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {customer.customerName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {customer.customerId}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            $
                                            {customer.totalRevenue.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {customer.totalOrders}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {customer.lastOrderDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge
                                                status={customer.status}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportingPage;
