import axios from "axios";

// API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Types for the dashboard data
export interface DashboardStats {
    quotations: number;
    rentals: number;
    revenue: number;
}

export interface ProductCategory {
    category: string;
    ordered: number;
    revenue: number;
}

export interface TopProduct {
    product: string;
    ordered: number;
    revenue: number;
}

export interface TopCustomer {
    customer: string;
    ordered: number;
    revenue: number;
}

export interface DashboardData {
    stats: DashboardStats;
    topProductCategories: ProductCategory[];
    topProducts: TopProduct[];
    topCustomers: TopCustomer[];
}

// API functions - These will make actual HTTP requests to backend endpoints
export const getDashboardStats = async (
    period: string = "last-30-days",
): Promise<DashboardStats> => {
    try {
        const response = await apiClient.get(
            `/dashboard/stats?period=${period}`,
        );
        return response.data as DashboardStats;
    } catch (error: unknown) {
        console.warn(
            "Backend endpoint not available, using fallback data:",
            error,
        );
        // Fallback to dummy data when backend is not available
        return {
            quotations: 10,
            rentals: 26,
            revenue: 10599,
        };
    }
};

export const getTopProductCategories = async (
    period: string = "last-30-days",
): Promise<ProductCategory[]> => {
    try {
        const response = await apiClient.get(
            `/dashboard/product-categories?period=${period}`,
        );
        return response.data as ProductCategory[];
    } catch (error: unknown) {
        console.warn(
            "Backend endpoint not available, using fallback data:",
            error,
        );
        // Fallback to dummy data when backend is not available
        return [{ category: "Rental - Service", ordered: 25, revenue: 2940 }];
    }
};

export const getTopProducts = async (
    period: string = "last-30-days",
): Promise<TopProduct[]> => {
    try {
        const response = await apiClient.get(
            `/dashboard/top-products?period=${period}`,
        );
        return response.data as TopProduct[];
    } catch (error: unknown) {
        console.warn(
            "Backend endpoint not available, using fallback data:",
            error,
        );
        // Fallback to dummy data when backend is not available
        return [
            { product: "Wheelchairs", ordered: 10, revenue: 3032 },
            { product: "tables", ordered: 5, revenue: 1008 },
            { product: "chairs", ordered: 4, revenue: 3008 },
        ];
    }
};

export const getTopCustomers = async (
    period: string = "last-30-days",
): Promise<TopCustomer[]> => {
    try {
        const response = await apiClient.get(
            `/dashboard/top-customers?period=${period}`,
        );
        return response.data as TopCustomer[];
    } catch (error: unknown) {
        console.warn(
            "Backend endpoint not available, using fallback data:",
            error,
        );
        // Fallback to dummy data when backend is not available
        return [
            { customer: "Customer1", ordered: 10, revenue: 3032 },
            { customer: "Customer2", ordered: 5, revenue: 1008 },
            { customer: "Customer3", ordered: 4, revenue: 3008 },
        ];
    }
};

export const getDashboardData = async (
    period: string = "last-30-days",
): Promise<DashboardData> => {
    try {
        const [stats, topProductCategories, topProducts, topCustomers] =
            await Promise.all([
                getDashboardStats(period),
                getTopProductCategories(period),
                getTopProducts(period),
                getTopCustomers(period),
            ]);

        return {
            stats,
            topProductCategories,
            topProducts,
            topCustomers,
        };
    } catch (error: unknown) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
};
