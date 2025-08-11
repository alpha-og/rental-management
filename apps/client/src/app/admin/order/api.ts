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

// Types for order data
export interface OrderData {
    id: string;
    customer: string;
    amount: number;
    createdBy: string;
    rentalStatus: "quotation" | "reserved" | "delivered" | "returned";
    invoiceStatus: "fully_invoiced" | "nothing_to_invoice" | "to_invoice";
    total: number;
}

export interface OrderListData {
    orders: OrderData[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}

// Fallback/dummy data
const FALLBACK_ORDERS: OrderData[] = [
    {
        id: "R0001",
        customer: "Acme Construction",
        amount: 3000,
        createdBy: "John Doe",
        rentalStatus: "quotation",
        invoiceStatus: "to_invoice",
        total: 3000,
    },
    {
        id: "R0002",
        customer: "BuildRight Inc",
        amount: 1500,
        createdBy: "Jane Smith",
        rentalStatus: "reserved",
        invoiceStatus: "nothing_to_invoice",
        total: 1500,
    },
    {
        id: "R0003",
        customer: "Metro Development",
        amount: 2500,
        createdBy: "Admin",
        rentalStatus: "delivered",
        invoiceStatus: "fully_invoiced",
        total: 2500,
    },
    {
        id: "R0004",
        customer: "Green Valley Homes",
        amount: 4000,
        createdBy: "Mike Johnson",
        rentalStatus: "returned",
        invoiceStatus: "fully_invoiced",
        total: 4000,
    },
    {
        id: "R0005",
        customer: "Urban Builders",
        amount: 1800,
        createdBy: "Sarah Wilson",
        rentalStatus: "quotation",
        invoiceStatus: "to_invoice",
        total: 1800,
    },
    {
        id: "R0006",
        customer: "Skyline Contractors",
        amount: 3500,
        createdBy: "Admin",
        rentalStatus: "delivered",
        invoiceStatus: "nothing_to_invoice",
        total: 3500,
    },
    {
        id: "R0007",
        customer: "Prime Construction",
        amount: 2200,
        createdBy: "Tom Brown",
        rentalStatus: "reserved",
        invoiceStatus: "to_invoice",
        total: 2200,
    },
    {
        id: "R0008",
        customer: "Elite Renovations",
        amount: 5000,
        createdBy: "Lisa Davis",
        rentalStatus: "delivered",
        invoiceStatus: "fully_invoiced",
        total: 5000,
    },
    {
        id: "R0009",
        customer: "Rapid Build Co",
        amount: 2800,
        createdBy: "Admin",
        rentalStatus: "quotation",
        invoiceStatus: "to_invoice",
        total: 2800,
    },
    {
        id: "R0010",
        customer: "Heritage Properties",
        amount: 3200,
        createdBy: "Mark Taylor",
        rentalStatus: "reserved",
        invoiceStatus: "nothing_to_invoice",
        total: 3200,
    },
    {
        id: "R0011",
        customer: "Future Builds",
        amount: 4500,
        createdBy: "Emma White",
        rentalStatus: "delivered",
        invoiceStatus: "to_invoice",
        total: 4500,
    },
    {
        id: "R0012",
        customer: "Solid Foundations",
        amount: 1900,
        createdBy: "Admin",
        rentalStatus: "returned",
        invoiceStatus: "fully_invoiced",
        total: 1900,
    },
];

// API functions
export const getOrderList = async (
    page = 1,
    limit = 20,
): Promise<OrderListData> => {
    try {
        const response = await apiClient.get(
            `/orders?page=${page}&limit=${limit}`,
        );
        return response.data as OrderListData;
    } catch (error) {
        console.warn(
            "Backend endpoint not available for order list, using fallback data:",
            error,
        );
        // Return paginated fallback data
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedOrders = FALLBACK_ORDERS.slice(startIndex, endIndex);

        return {
            orders: paginatedOrders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(FALLBACK_ORDERS.length / limit),
                totalItems: FALLBACK_ORDERS.length,
            },
        };
    }
};

export const getOrderById = async (orderId: string): Promise<OrderData> => {
    try {
        const response = await apiClient.get(`/orders/${orderId}`);
        return response.data as OrderData;
    } catch (error) {
        console.warn(
            `Backend endpoint not available for order ${orderId}, using fallback data:`,
            error,
        );
        // Return fallback order data
        const fallbackOrder = FALLBACK_ORDERS.find(
            (order) => order.id === orderId,
        );
        return fallbackOrder || FALLBACK_ORDERS[0];
    }
};

export const updateOrderStatus = async (
    orderId: string,
    status: OrderData["rentalStatus"],
): Promise<OrderData> => {
    try {
        const response = await apiClient.put(`/orders/${orderId}/status`, {
            status,
        });
        return response.data as OrderData;
    } catch (error) {
        console.warn(
            `Backend endpoint not available for updating order ${orderId} status, using fallback behavior:`,
            error,
        );
        // Return fallback updated order
        const fallbackOrder = FALLBACK_ORDERS.find(
            (order) => order.id === orderId,
        );
        return {
            ...(fallbackOrder || FALLBACK_ORDERS[0]),
            rentalStatus: status,
        };
    }
};

export const createNewOrder = async (): Promise<OrderData> => {
    try {
        const response = await apiClient.post("/orders");
        return response.data as OrderData;
    } catch (error) {
        console.warn(
            "Backend endpoint not available for creating new order, using fallback behavior:",
            error,
        );
        // Return fallback new order
        return {
            id: `R${String(Date.now()).slice(-4)}`,
            customer: "New Customer",
            amount: 0,
            createdBy: "Admin",
            rentalStatus: "quotation",
            invoiceStatus: "to_invoice",
            total: 0,
        };
    }
};
