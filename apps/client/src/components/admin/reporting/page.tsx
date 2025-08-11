"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
    RefreshCw,
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
    const maxRevenue = Math.max(1, ...data.map((d) => d.revenue));
    const displayed = data.slice(-6);
    const barCount = displayed.length;
    const chartHeight = 200; // px
    const ticks = [0, 0.25, 0.5, 0.75, 1];

    const formatK = (n: number) => `$${(n / 1000).toFixed(0)}k`;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="relative" style={{ height: chartHeight }}>
                    {/* Horizontal gridlines and Y-axis labels */}
                    {ticks.map((t) => (
                        <div
                            key={`grid-${t}`}
                            className="absolute left-0 right-0"
                            style={{ bottom: t * chartHeight }}
                        >
                            <div
                                className="absolute left-0 -translate-x-1/2 text-xs text-gray-500 select-none"
                                style={{ transform: "translate(-10px, 6px)" }}
                            >
                                {formatK(t * maxRevenue)}
                            </div>
                            <div className="border-t border-gray-200" />
                        </div>
                    ))}

                    {/* Vertical separators aligned to bars */}
                    {barCount > 1 && (
                        <div className="absolute inset-0 pointer-events-none">
                            {displayed.map((_, idx) => (
                                <div
                                    key={`v-${idx}`}
                                    className="absolute top-0 bottom-0 border-l border-gray-100"
                                    style={{
                                        left: `${(idx / (barCount - 1)) * 100}%`,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end justify-between px-4">
                        {displayed.map((item) => (
                            <div
                                key={item.period}
                                className="flex flex-col items-center"
                                style={{ width: `${100 / barCount}%` }}
                            >
                                <div className="text-[10px] text-gray-600 mb-1">
                                    {formatK(item.revenue)}
                                </div>
                                <div
                                    className="bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 mx-auto"
                                    style={{
                                        height: `${(item.revenue / maxRevenue) * chartHeight}px`,
                                        minHeight: 4,
                                        width: 24,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {/* X-axis labels */}
                <div className="mt-2 flex justify-between px-4">
                    {displayed.map((item) => (
                        <div
                            key={`label-${item.period}`}
                            className="text-xs text-gray-700 font-medium"
                            style={{
                                width: `${100 / barCount}%`,
                                textAlign: "center",
                            }}
                        >
                            {item.period}
                        </div>
                    ))}
                </div>
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
    // Build a segmented conic-gradient from category percentages
    const gradient = (() => {
        let acc = 0;
        const parts: string[] = [];
        data.forEach((item) => {
            const start = acc;
            const end = acc + item.percentage;
            parts.push(`${item.color} ${start}% ${end}%`);
            acc = end;
        });
        return `conic-gradient(${parts.join(", ")})`;
    })();

    const total = data.reduce((sum, item) => sum + item.revenue, 0);

    // Hover state and positioning
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{
        x: number;
        y: number;
    } | null>(null);

    const getSegmentIndexFromAngle = (anglePct: number) => {
        let acc = 0;
        for (let i = 0; i < data.length; i++) {
            const start = acc;
            const end = acc + data[i].percentage;
            if (anglePct >= start && anglePct < end) return i;
            acc = end;
        }
        return data.length - 1; // fallback to last segment
    };

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx, dy);

        // Outer radius and inner radius (inset-6 ~ 24px)
        const outerR = rect.width / 2;
        const innerInset = 24; // px, matches Tailwind inset-6
        const innerR = outerR - innerInset;

        // Only consider points within the donut ring
        if (dist < innerR || dist > outerR) {
            setHoveredIndex(null);
            setTooltipPos(null);
            return;
        }

        // 0 degrees at +X axis, clockwise, convert to [0,100)% percentage of circle
        const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
        const normDeg = (angleDeg + 360) % 360;
        const anglePct = (normDeg / 360) * 100;
        const idx = getSegmentIndexFromAngle(anglePct);
        setHoveredIndex(idx);

        // Position tooltip slightly away from cursor
        const mag = Math.max(1, Math.hypot(dx, dy));
        const ux = dx / mag;
        const uy = dy / mag;
        const offset = 10; // px
        let tx = x + ux * offset;
        let ty = y + uy * offset;

        // Clamp within container
        tx = Math.min(Math.max(8, tx), rect.width - 8);
        ty = Math.min(Math.max(8, ty), rect.height - 8);
        setTooltipPos({ x: tx, y: ty });
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
        setTooltipPos(null);
    };

    // Highlight overlay to dim non-hovered segments
    const overlayGradient = (() => {
        if (hoveredIndex == null) return undefined;
        let acc = 0;
        for (let i = 0; i < data.length; i++) {
            const start = acc;
            const end = acc + data[i].percentage;
            if (i === hoveredIndex) {
                const before = `rgba(0,0,0,0.15) 0% ${start}%`;
                const target = `transparent ${start}% ${end}%`;
                const after = `rgba(0,0,0,0.15) ${end}% 100%`;
                return `conic-gradient(${before}, ${target}, ${after})`;
            }
            acc = end;
        }
        return undefined;
    })();

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center justify-center">
                <div
                    ref={containerRef}
                    className="relative w-48 h-48"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Segmented donut using conic-gradient */}
                    <div
                        className="w-full h-full rounded-full"
                        style={{ background: gradient }}
                    />

                    {/* Highlight overlay: dims non-hovered segments */}
                    {overlayGradient && (
                        <div
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{ background: overlayGradient }}
                        />
                    )}

                    <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                ${(total / 1000).toFixed(0)}k
                            </div>
                            <div className="text-sm text-gray-600">Total</div>
                        </div>
                    </div>

                    {/* Tooltip */}
                    {hoveredIndex != null && tooltipPos && (
                        <div
                            className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-md px-2 py-1 text-xs text-gray-900 whitespace-nowrap"
                            style={{
                                left: tooltipPos.x,
                                top: tooltipPos.y,
                                transform: "translate(-50%, -120%)",
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="inline-block w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor:
                                            data[hoveredIndex].color,
                                    }}
                                />
                                <span className="font-medium">
                                    {data[hoveredIndex].category}
                                </span>
                            </div>
                            <div className="mt-0.5 text-gray-600">
                                {data[hoveredIndex].percentage}% • $
                                {data[hoveredIndex].revenue.toLocaleString()}
                            </div>
                        </div>
                    )}
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
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<number | null>(null);

    // Load data on component mount and period change
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getReportingData(selectedPeriod);
            setReportingData(data);
            setLastUpdated(Date.now());
        } catch (error) {
            console.error("Failed to load reporting data:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedPeriod]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    // Auto-refresh polling
    useEffect(() => {
        if (!autoRefresh) return;
        const id = setInterval(() => {
            void loadData();
        }, 30000); // 30s
        return () => clearInterval(id);
    }, [autoRefresh, loadData]);

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
                    <div className="flex items-center gap-3 text-gray-600">
                        <p>Track performance and analyze business metrics</p>
                        {lastUpdated && (
                            <span className="text-xs text-gray-500">
                                Updated{" "}
                                {new Date(lastUpdated).toLocaleTimeString()}
                            </span>
                        )}
                    </div>
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
                <div className="ml-auto flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                        />
                        Auto-refresh
                    </label>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void loadData()}
                        className="flex items-center gap-1"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
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
