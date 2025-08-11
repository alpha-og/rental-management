import axios from "axios";

// API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Types for reporting data
export interface RevenueData {
    period: string;
    revenue: number;
    orders: number;
    growth: number;
}

export interface CategoryData {
    category: string;
    revenue: number;
    percentage: number;
    color: string;
}

export interface ProductPerformanceData {
    productId: string;
    productName: string;
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    availability: "available" | "rented" | "maintenance";
}

export interface CustomerData {
    customerId: string;
    customerName: string;
    totalOrders: number;
    totalRevenue: number;
    lastOrderDate: string;
    status: "active" | "inactive";
}

export interface AnalyticsOverview {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    revenueGrowth: number;
    ordersGrowth: number;
    customersGrowth: number;
    productsGrowth: number;
}

export interface ReportingData {
    overview: AnalyticsOverview;
    revenueChart: RevenueData[];
    categoryBreakdown: CategoryData[];
    productPerformance: ProductPerformanceData[];
    topCustomers: CustomerData[];
    periodComparison: {
        current: number;
        previous: number;
        change: number;
    };
}

// Fallback/dummy data for development
const FALLBACK_REPORTING_DATA: ReportingData = {
    overview: {
        totalRevenue: 125000,
        totalOrders: 345,
        totalCustomers: 89,
        totalProducts: 156,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
        customersGrowth: 15.2,
        productsGrowth: 3.1,
    },
    revenueChart: [
        { period: "Jan", revenue: 8500, orders: 25, growth: 5.2 },
        { period: "Feb", revenue: 9200, orders: 28, growth: 8.2 },
        { period: "Mar", revenue: 11000, orders: 32, growth: 19.6 },
        { period: "Apr", revenue: 10500, orders: 30, growth: -4.5 },
        { period: "May", revenue: 12800, orders: 38, growth: 21.9 },
        { period: "Jun", revenue: 14200, orders: 42, growth: 10.9 },
        { period: "Jul", revenue: 13500, orders: 39, growth: -4.9 },
        { period: "Aug", revenue: 15600, orders: 45, growth: 15.6 },
        { period: "Sep", revenue: 14900, orders: 43, growth: -4.5 },
        { period: "Oct", revenue: 16800, orders: 48, growth: 12.8 },
        { period: "Nov", revenue: 18200, orders: 52, growth: 8.3 },
        { period: "Dec", revenue: 19500, orders: 55, growth: 7.1 },
    ],
    categoryBreakdown: [
        {
            category: "Heavy Machinery",
            revenue: 45000,
            percentage: 36,
            color: "#3B82F6",
        },
        {
            category: "Construction Equipment",
            revenue: 32000,
            percentage: 25.6,
            color: "#10B981",
        },
        {
            category: "Lifting Equipment",
            revenue: 28000,
            percentage: 22.4,
            color: "#F59E0B",
        },
        {
            category: "Material Handling",
            revenue: 15000,
            percentage: 12,
            color: "#EF4444",
        },
        {
            category: "Safety Equipment",
            revenue: 5000,
            percentage: 4,
            color: "#8B5CF6",
        },
    ],
    productPerformance: [
        {
            productId: "P001",
            productName: "Excavator 20T",
            totalRevenue: 25000,
            totalOrders: 45,
            averageOrderValue: 556,
            availability: "available",
        },
        {
            productId: "P002",
            productName: "Tower Crane",
            totalRevenue: 22000,
            totalOrders: 28,
            averageOrderValue: 786,
            availability: "rented",
        },
        {
            productId: "P003",
            productName: "Concrete Mixer",
            totalRevenue: 18000,
            totalOrders: 65,
            averageOrderValue: 277,
            availability: "available",
        },
        {
            productId: "P004",
            productName: "Forklift 5T",
            totalRevenue: 15000,
            totalOrders: 42,
            averageOrderValue: 357,
            availability: "maintenance",
        },
        {
            productId: "P005",
            productName: "Bulldozer",
            totalRevenue: 12000,
            totalOrders: 18,
            averageOrderValue: 667,
            availability: "available",
        },
    ],
    topCustomers: [
        {
            customerId: "C001",
            customerName: "Acme Construction",
            totalOrders: 28,
            totalRevenue: 35000,
            lastOrderDate: "2025-08-10",
            status: "active",
        },
        {
            customerId: "C002",
            customerName: "BuildRight Inc",
            totalOrders: 22,
            totalRevenue: 28000,
            lastOrderDate: "2025-08-08",
            status: "active",
        },
        {
            customerId: "C003",
            customerName: "Metro Development",
            totalOrders: 18,
            totalRevenue: 22000,
            lastOrderDate: "2025-08-05",
            status: "active",
        },
        {
            customerId: "C004",
            customerName: "Green Valley Homes",
            totalOrders: 15,
            totalRevenue: 18000,
            lastOrderDate: "2025-07-28",
            status: "inactive",
        },
        {
            customerId: "C005",
            customerName: "Urban Builders",
            totalOrders: 12,
            totalRevenue: 15000,
            lastOrderDate: "2025-08-09",
            status: "active",
        },
    ],
    periodComparison: {
        current: 125000,
        previous: 108000,
        change: 15.7,
    },
};

// API functions
export const getReportingData = async (
    period: "7d" | "30d" | "90d" | "1y" = "30d",
): Promise<ReportingData> => {
    try {
        const response = await apiClient.get(
            `/reporting/analytics?period=${period}`,
        );
        return response.data as ReportingData;
    } catch (error) {
        console.warn(
            "Backend endpoint not available for reporting data, using fallback data:",
            error,
        );
        return FALLBACK_REPORTING_DATA;
    }
};

export const getRevenueChart = async (
    period: "7d" | "30d" | "90d" | "1y" = "30d",
): Promise<RevenueData[]> => {
    try {
        const response = await apiClient.get(
            `/reporting/revenue?period=${period}`,
        );
        return response.data as RevenueData[];
    } catch (error) {
        console.warn(
            "Backend endpoint not available for revenue chart, using fallback data:",
            error,
        );
        return FALLBACK_REPORTING_DATA.revenueChart;
    }
};

export const getCategoryBreakdown = async (): Promise<CategoryData[]> => {
    try {
        const response = await apiClient.get("/reporting/categories");
        return response.data as CategoryData[];
    } catch (error) {
        console.warn(
            "Backend endpoint not available for category breakdown, using fallback data:",
            error,
        );
        return FALLBACK_REPORTING_DATA.categoryBreakdown;
    }
};

export const getProductPerformance = async (): Promise<
    ProductPerformanceData[]
> => {
    try {
        const response = await apiClient.get("/reporting/products");
        return response.data as ProductPerformanceData[];
    } catch (error) {
        console.warn(
            "Backend endpoint not available for product performance, using fallback data:",
            error,
        );
        return FALLBACK_REPORTING_DATA.productPerformance;
    }
};

export const getTopCustomers = async (): Promise<CustomerData[]> => {
    try {
        const response = await apiClient.get("/reporting/customers");
        return response.data as CustomerData[];
    } catch (error) {
        console.warn(
            "Backend endpoint not available for top customers, using fallback data:",
            error,
        );
        return FALLBACK_REPORTING_DATA.topCustomers;
    }
};

export const exportReport = async (
    type: "revenue" | "products" | "customers" | "full",
    format: "csv" | "pdf" = "csv",
): Promise<Blob> => {
    try {
        const response = await apiClient.get(
            `/reporting/export?type=${type}&format=${format}`,
            {
                responseType: "blob",
            },
        );
        return response.data as Blob;
    } catch (error) {
        console.warn(
            "Backend endpoint not available for export, creating fallback export:",
            error,
        );
        // Create fallback CSV content
        let csvContent = "";
        const data = FALLBACK_REPORTING_DATA;

        switch (type) {
            case "revenue":
                csvContent =
                    "Period,Revenue,Orders,Growth\n" +
                    data.revenueChart
                        .map(
                            (item) =>
                                `${item.period},${item.revenue},${item.orders},${item.growth}`,
                        )
                        .join("\n");
                break;
            case "products":
                csvContent =
                    "Product ID,Product Name,Revenue,Orders,Average Order Value,Availability\n" +
                    data.productPerformance
                        .map(
                            (item) =>
                                `${item.productId},"${item.productName}",${item.totalRevenue},${item.totalOrders},${item.averageOrderValue},${item.availability}`,
                        )
                        .join("\n");
                break;
            case "customers":
                csvContent =
                    "Customer ID,Customer Name,Orders,Revenue,Last Order,Status\n" +
                    data.topCustomers
                        .map(
                            (item) =>
                                `${item.customerId},"${item.customerName}",${item.totalOrders},${item.totalRevenue},${item.lastOrderDate},${item.status}`,
                        )
                        .join("\n");
                break;
            default:
                csvContent =
                    "Full Report\nTotal Revenue," +
                    data.overview.totalRevenue +
                    "\nTotal Orders," +
                    data.overview.totalOrders;
        }

        return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    }
};
