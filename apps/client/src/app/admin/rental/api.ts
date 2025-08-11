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

// Types for rental data
export interface RentalFormData {
    id: string;
    customer: string;
    invoiceAddress: string;
    deliveryAddress: string;
    rentalTemplate: string;
    expiration: string;
    rentalOrderDate: string;
    priceList: string;
    rentalPeriod: string;
    rentalDuration: string;
    status: "draft" | "quotation_sent" | "confirmed" | "cancelled";
    deliveryStatus?: "pending" | "pickup_ready" | "delivered" | "returned";
    invoiceStatus?: "pending" | "created" | "sent" | "paid";
}

export interface RentalOrderLine {
    id: string;
    product: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    subTotal: number;
}

export interface DeliveryOrder {
    id: string;
    rentalId: string;
    type: "pickup" | "return";
    status: "pending" | "ready" | "in_transit" | "completed";
    scheduledDate: string;
    address: string;
    notes?: string;
}

export interface Invoice {
    id: string;
    rentalId: string;
    amount: number;
    status: "draft" | "sent" | "paid" | "overdue";
    createdDate: string;
    dueDate: string;
}

export interface RentalData {
    rental: RentalFormData;
    orderLines: RentalOrderLine[];
    termsAndConditions: string;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}

// Fallback/dummy data
const FALLBACK_RENTAL_DATA: RentalData = {
    rental: {
        id: "R0001",
        customer: "Acme Corporation",
        invoiceAddress: "123 Business St, Business City, BC 12345",
        deliveryAddress: "456 Delivery Ave, Delivery Town, DT 67890",
        rentalTemplate: "Standard Rental Template",
        expiration: "2025-09-15",
        rentalOrderDate: "2025-08-11",
        priceList: "Standard Price List",
        rentalPeriod: "Monthly",
        rentalDuration: "6 months",
        status: "quotation_sent",
        deliveryStatus: "pending",
        invoiceStatus: "pending",
    },
    orderLines: [
        {
            id: "ol-1",
            product: "Office Chair Premium",
            quantity: 5,
            unitPrice: 200,
            tax: 0,
            subTotal: 1000,
        },
        {
            id: "ol-2",
            product: "Standing Desk Adjustable",
            quantity: 3,
            unitPrice: 450,
            tax: 135,
            subTotal: 1485,
        },
        {
            id: "ol-3",
            product: "Monitor Arm Dual",
            quantity: 8,
            unitPrice: 120,
            tax: 96,
            subTotal: 1056,
        },
    ],
    termsAndConditions:
        "1. All rental equipment must be returned in original condition.\n2. Monthly payments are due on the 1st of each month.\n3. Late fees apply after 15 days past due date.\n4. Equipment insurance is included in the rental fee.\n5. Customer is responsible for normal wear and tear.",
    pagination: {
        currentPage: 1,
        totalPages: 80,
        totalItems: 158,
    },
};

const FALLBACK_RENTAL_LIST: RentalFormData[] = [
    {
        id: "R0001",
        customer: "Acme Corporation",
        invoiceAddress: "123 Business St, Business City, BC 12345",
        deliveryAddress: "456 Delivery Ave, Delivery Town, DT 67890",
        rentalTemplate: "Standard Rental Template",
        expiration: "2025-09-15",
        rentalOrderDate: "2025-08-11",
        priceList: "Standard Price List",
        rentalPeriod: "Monthly",
        rentalDuration: "6 months",
        status: "quotation_sent",
        deliveryStatus: "pending",
        invoiceStatus: "pending",
    },
    {
        id: "R0002",
        customer: "Tech Solutions Ltd",
        invoiceAddress: "789 Tech Park, Innovation City, IC 54321",
        deliveryAddress: "789 Tech Park, Innovation City, IC 54321",
        rentalTemplate: "Premium Rental Template",
        expiration: "2025-10-01",
        rentalOrderDate: "2025-08-10",
        priceList: "Premium Price List",
        rentalPeriod: "Weekly",
        rentalDuration: "12 weeks",
        status: "confirmed",
        deliveryStatus: "pickup_ready",
        invoiceStatus: "created",
    },
    {
        id: "R0003",
        customer: "StartUp Ventures",
        invoiceAddress: "321 Startup Blvd, Entrepreneur City, EC 98765",
        deliveryAddress: "654 Co-work Space, Shared Office, SO 13579",
        rentalTemplate: "Startup Rental Template",
        expiration: "2025-08-25",
        rentalOrderDate: "2025-08-09",
        priceList: "Discounted Price List",
        rentalPeriod: "Daily",
        rentalDuration: "30 days",
        status: "draft",
        deliveryStatus: "pending",
        invoiceStatus: "pending",
    },
    {
        id: "R0004",
        customer: "Global Enterprise Inc",
        invoiceAddress: "555 Corporate Plaza, Metro City, MC 11111",
        deliveryAddress: "777 Distribution Center, Logistics Hub, LH 22222",
        rentalTemplate: "Enterprise Rental Template",
        expiration: "2025-12-31",
        rentalOrderDate: "2025-08-08",
        priceList: "Enterprise Price List",
        rentalPeriod: "Quarterly",
        rentalDuration: "2 years",
        status: "confirmed",
        deliveryStatus: "delivered",
        invoiceStatus: "paid",
    },
    {
        id: "R0005",
        customer: "Small Business Co",
        invoiceAddress: "99 Main Street, Small Town, ST 33333",
        deliveryAddress: "99 Main Street, Small Town, ST 33333",
        rentalTemplate: "Basic Rental Template",
        expiration: "2025-09-01",
        rentalOrderDate: "2025-08-07",
        priceList: "Basic Price List",
        rentalPeriod: "Monthly",
        rentalDuration: "3 months",
        status: "cancelled",
        deliveryStatus: "pending",
        invoiceStatus: "pending",
    },
];

// API functions
export const getRentalData = async (rentalId: string): Promise<RentalData> => {
    try {
        const response = await apiClient.get(`/rentals/${rentalId}`);
        return response.data as RentalData;
    } catch (error) {
        console.warn(
            `Backend endpoint not available for rental ${rentalId}, using fallback data:`,
            error,
        );
        // Return fallback data with the requested ID if it exists
        const fallbackRental =
            FALLBACK_RENTAL_LIST.find((r) => r.id === rentalId) ||
            FALLBACK_RENTAL_DATA.rental;
        return {
            ...FALLBACK_RENTAL_DATA,
            rental: { ...FALLBACK_RENTAL_DATA.rental, ...fallbackRental },
        };
    }
};

export const getRentalList = async (
    page: number = 1,
    limit: number = 10,
): Promise<{
    rentals: RentalFormData[];
    pagination: RentalData["pagination"];
}> => {
    try {
        const response = await apiClient.get(
            `/rentals?page=${page}&limit=${limit}`,
        );
        return response.data as {
            rentals: RentalFormData[];
            pagination: RentalData["pagination"];
        };
    } catch (error) {
        console.warn(
            "Backend endpoint not available for rental list, using fallback data:",
            error,
        );
        // Return paginated fallback data
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedRentals = FALLBACK_RENTAL_LIST.slice(
            startIndex,
            endIndex,
        );

        return {
            rentals: paginatedRentals,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(FALLBACK_RENTAL_LIST.length / limit),
                totalItems: FALLBACK_RENTAL_LIST.length,
            },
        };
    }
};

export const updateRentalData = async (
    rentalId: string,
    updates: Partial<RentalFormData>,
): Promise<RentalFormData> => {
    try {
        const response = await apiClient.put(`/rentals/${rentalId}`, updates);
        return response.data as RentalFormData;
    } catch (error) {
        console.warn(
            `Backend endpoint not available for updating rental ${rentalId}, using fallback behavior:`,
            error,
        );
        // Return updated fallback data (simulate successful update)
        const fallbackRental =
            FALLBACK_RENTAL_LIST.find((r) => r.id === rentalId) ||
            FALLBACK_RENTAL_DATA.rental;
        return { ...fallbackRental, ...updates };
    }
};

export const updateRentalStatus = async (
    rentalId: string,
    action: "send" | "print" | "confirm" | "cancel",
): Promise<RentalFormData> => {
    try {
        const response = await apiClient.post(`/rentals/${rentalId}/actions`, {
            action,
        });
        return response.data as RentalFormData;
    } catch (error) {
        console.warn(
            `Backend endpoint not available for rental action ${action} on ${rentalId}, using fallback behavior:`,
            error,
        );
        // Return fallback data with simulated status change
        const fallbackRental =
            FALLBACK_RENTAL_LIST.find((r) => r.id === rentalId) ||
            FALLBACK_RENTAL_DATA.rental;
        let newStatus = fallbackRental.status;

        switch (action) {
            case "send":
                newStatus = "quotation_sent";
                break;
            case "confirm":
                newStatus = "confirmed";
                break;
            case "cancel":
                newStatus = "cancelled";
                break;
            // print doesn't change status
        }

        return { ...fallbackRental, status: newStatus };
    }
};

export const addOrderLine = async (
    rentalId: string,
    orderLine: Omit<RentalOrderLine, "id">,
): Promise<RentalOrderLine> => {
    try {
        const response = await apiClient.post(
            `/rentals/${rentalId}/order-lines`,
            orderLine,
        );
        return response.data as RentalOrderLine;
    } catch (error) {
        console.warn(
            `Backend endpoint not available for adding order line to rental ${rentalId}, using fallback behavior:`,
            error,
        );
        // Return fallback data with generated ID
        return { ...orderLine, id: `ol-${Date.now()}` };
    }
};

export const updateOrderLine = async (
    rentalId: string,
    orderLineId: string,
    updates: Partial<RentalOrderLine>,
): Promise<RentalOrderLine> => {
    try {
        const response = await apiClient.put(
            `/rentals/${rentalId}/order-lines/${orderLineId}`,
            updates,
        );
        return response.data as RentalOrderLine;
    } catch (error) {
        console.warn(
            `Backend endpoint not available for updating order line ${orderLineId}, using fallback behavior:`,
            error,
        );
        // Return fallback updated order line
        const fallbackLine =
            FALLBACK_RENTAL_DATA.orderLines.find(
                (ol) => ol.id === orderLineId,
            ) || FALLBACK_RENTAL_DATA.orderLines[0];
        return { ...fallbackLine, ...updates };
    }
};

export const deleteOrderLine = async (
    rentalId: string,
    orderLineId: string,
): Promise<void> => {
    try {
        await apiClient.delete(
            `/rentals/${rentalId}/order-lines/${orderLineId}`,
        );
    } catch (error) {
        console.warn(
            `Backend endpoint not available for deleting order line ${orderLineId}, using fallback behavior:`,
            error,
        );
        // Simulate successful deletion (no-op in fallback)
    }
};

// New API functions for enhanced features

export const createDeliveryOrders = async (
    rentalId: string,
): Promise<{ pickup: DeliveryOrder; return: DeliveryOrder }> => {
    try {
        const response = await apiClient.post(
            `/rentals/${rentalId}/delivery-orders`,
        );
        return response.data as {
            pickup: DeliveryOrder;
            return: DeliveryOrder;
        };
    } catch (error) {
        console.warn(
            `Backend endpoint not available for creating delivery orders for rental ${rentalId}, using fallback behavior:`,
            error,
        );
        // Return fallback delivery orders
        const pickup: DeliveryOrder = {
            id: `pickup-${Date.now()}`,
            rentalId,
            type: "pickup",
            status: "pending",
            scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0], // tomorrow
            address: FALLBACK_RENTAL_DATA.rental.deliveryAddress,
            notes: "Pickup delivery order created automatically",
        };

        const returnOrder: DeliveryOrder = {
            id: `return-${Date.now()}`,
            rentalId,
            type: "return",
            status: "pending",
            scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0], // 30 days later
            address: FALLBACK_RENTAL_DATA.rental.deliveryAddress,
            notes: "Return delivery order created automatically",
        };

        return { pickup, return: returnOrder };
    }
};

export const createInvoice = async (rentalId: string): Promise<Invoice> => {
    try {
        const response = await apiClient.post(`/rentals/${rentalId}/invoice`);
        return response.data as Invoice;
    } catch (error) {
        console.warn(
            `Backend endpoint not available for creating invoice for rental ${rentalId}, using fallback behavior:`,
            error,
        );
        // Calculate total from order lines
        const total = FALLBACK_RENTAL_DATA.orderLines.reduce(
            (sum, line) => sum + line.subTotal,
            0,
        );

        return {
            id: `INV-${Date.now()}`,
            rentalId,
            amount: total,
            status: "draft",
            createdDate: new Date().toISOString().split("T")[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
        };
    }
};

export const redirectToPickupTransfer = async (
    rentalId: string,
): Promise<string> => {
    try {
        const response = await apiClient.get(
            `/rentals/${rentalId}/pickup-transfer-url`,
        );
        return (response.data as { url: string }).url;
    } catch (error) {
        console.warn(
            `Backend endpoint not available for pickup transfer redirect for rental ${rentalId}, using fallback behavior:`,
            error,
        );
        // Return fallback URL
        return `/admin/transfers/pickup?rental=${rentalId}`;
    }
};
