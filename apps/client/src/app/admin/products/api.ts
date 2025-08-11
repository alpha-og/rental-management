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

// Types for product data
export interface ProductData {
    id: string;
    name: string;
    description: string;
    category: string;
    unitPrice: number;
    rentalPeriod: "daily" | "weekly" | "monthly";
    availability: "available" | "rented" | "maintenance";
    stockQuantity: number;
    rentalPricing: {
        extraHour: number;
        extraDay: number;
        priceList: number;
    };
}

export interface TransferData {
    id: string;
    type: "pickup" | "delivery";
    customer: string;
    invoiceAddress: string;
    deliveryAddress: string;
    sourceLocation: string;
    scheduleDate: string;
    responsible: string;
    transferType: string;
    status: "draft" | "ready" | "done";
    transferLines: TransferLineData[];
    untaxedTotal: number;
    tax: number;
    total: number;
}

export interface TransferLineData {
    product: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    subTotal: number;
}

export interface ReturnData {
    id: string;
    receivedFromCustomer: string;
    pickupAddress: string;
    destinationLocation: string;
    scheduleDate: string;
    responsible: string;
    transferType: string;
    status: "draft" | "waiting" | "ready" | "done";
    transferLines: TransferLineData[];
    untaxedTotal: number;
    tax: number;
    total: number;
}

// Fallback/dummy data
const FALLBACK_PRODUCTS: ProductData[] = [
    {
        id: "P001",
        name: "Excavator 20T",
        description: "Heavy duty excavator for construction projects",
        category: "Heavy Machinery",
        unitPrice: 500,
        rentalPeriod: "daily",
        availability: "available",
        stockQuantity: 3,
        rentalPricing: {
            extraHour: 50,
            extraDay: 450,
            priceList: 500,
        },
    },
    {
        id: "P002",
        name: "Concrete Mixer",
        description: "Industrial concrete mixer for large projects",
        category: "Construction Equipment",
        unitPrice: 150,
        rentalPeriod: "daily",
        availability: "rented",
        stockQuantity: 5,
        rentalPricing: {
            extraHour: 20,
            extraDay: 130,
            priceList: 150,
        },
    },
    {
        id: "P003",
        name: "Tower Crane",
        description: "High-capacity tower crane for building construction",
        category: "Lifting Equipment",
        unitPrice: 800,
        rentalPeriod: "weekly",
        availability: "available",
        stockQuantity: 2,
        rentalPricing: {
            extraHour: 100,
            extraDay: 750,
            priceList: 800,
        },
    },
    {
        id: "P004",
        name: "Forklift 5T",
        description: "Electric forklift for warehouse operations",
        category: "Material Handling",
        unitPrice: 200,
        rentalPeriod: "daily",
        availability: "maintenance",
        stockQuantity: 4,
        rentalPricing: {
            extraHour: 25,
            extraDay: 180,
            priceList: 200,
        },
    },
];

const FALLBACK_TRANSFERS: TransferData[] = [
    {
        id: "PICKUP/OUT/0001",
        type: "pickup",
        customer: "Acme Construction",
        invoiceAddress: "123 Business Ave, City",
        deliveryAddress: "456 Project Site, City",
        sourceLocation: "Main Warehouse",
        scheduleDate: "2025-08-12",
        responsible: "John Doe",
        transferType: "Delivery Order",
        status: "ready",
        transferLines: [
            {
                product: "Product 1",
                quantity: 5,
                unitPrice: 200,
                tax: 0,
                subTotal: 1000,
            },
        ],
        untaxedTotal: 1000,
        tax: 0,
        total: 1000,
    },
];

const FALLBACK_RETURNS: ReturnData[] = [
    {
        id: "RETURN/IN/0001",
        receivedFromCustomer: "Acme Construction",
        pickupAddress: "456 Project Site, City",
        destinationLocation: "Main Warehouse",
        scheduleDate: "2025-08-15",
        responsible: "Jane Smith",
        transferType: "Return Order",
        status: "waiting",
        transferLines: [
            {
                product: "Product 1",
                quantity: 5,
                unitPrice: 200,
                tax: 0,
                subTotal: 1000,
            },
        ],
        untaxedTotal: 1000,
        tax: 0,
        total: 1000,
    },
];

// API functions
export const getProducts = async (): Promise<ProductData[]> => {
    try {
        const response = await apiClient.get("/products");
        return response.data as ProductData[];
    } catch (error) {
        console.warn(
            "Backend endpoint not available for products, using fallback data:",
            error,
        );
        return FALLBACK_PRODUCTS;
    }
};

export const getProductById = async (
    productId: string,
): Promise<ProductData> => {
    try {
        const response = await apiClient.get(`/products/${productId}`);
        return response.data as ProductData;
    } catch (error) {
        console.warn(
            `Backend endpoint not available for product ${productId}, using fallback data:`,
            error,
        );
        const fallbackProduct = FALLBACK_PRODUCTS.find(
            (product) => product.id === productId,
        );
        return fallbackProduct || FALLBACK_PRODUCTS[0];
    }
};

export const createProduct = async (
    productData: Partial<ProductData>,
): Promise<ProductData> => {
    try {
        const response = await apiClient.post("/products", productData);
        return response.data as ProductData;
    } catch (error) {
        console.warn(
            "Backend endpoint not available for creating product, using fallback behavior:",
            error,
        );
        return {
            id: `P${String(Date.now()).slice(-3)}`,
            name: productData.name || "New Product",
            description: productData.description || "",
            category: productData.category || "General",
            unitPrice: productData.unitPrice || 0,
            rentalPeriod: productData.rentalPeriod || "daily",
            availability: "available",
            stockQuantity: productData.stockQuantity || 1,
            rentalPricing: {
                extraHour: 0,
                extraDay: 0,
                priceList: productData.unitPrice || 0,
            },
        };
    }
};

export const updateProduct = async (
    productId: string,
    productData: Partial<ProductData>,
): Promise<ProductData> => {
    try {
        const response = await apiClient.put(
            `/products/${productId}`,
            productData,
        );
        return response.data as ProductData;
    } catch (error) {
        console.warn(
            `Backend endpoint not available for updating product ${productId}, using fallback behavior:`,
            error,
        );
        const fallbackProduct = FALLBACK_PRODUCTS.find(
            (product) => product.id === productId,
        );
        return {
            ...(fallbackProduct || FALLBACK_PRODUCTS[0]),
            ...productData,
        } as ProductData;
    }
};

export const deleteProduct = async (productId: string): Promise<void> => {
    try {
        await apiClient.delete(`/products/${productId}`);
    } catch (error) {
        console.warn(
            `Backend endpoint not available for deleting product ${productId}, using fallback behavior:`,
            error,
        );
    }
};

export const getTransfers = async (): Promise<TransferData[]> => {
    try {
        const response = await apiClient.get("/transfers");
        return response.data as TransferData[];
    } catch (error) {
        console.warn(
            "Backend endpoint not available for transfers, using fallback data:",
            error,
        );
        return FALLBACK_TRANSFERS;
    }
};

export const getReturns = async (): Promise<ReturnData[]> => {
    try {
        const response = await apiClient.get("/returns");
        return response.data as ReturnData[];
    } catch (error) {
        console.warn(
            "Backend endpoint not available for returns, using fallback data:",
            error,
        );
        return FALLBACK_RETURNS;
    }
};

export const createTransfer = async (
    transferData: Partial<TransferData>,
): Promise<TransferData> => {
    try {
        const response = await apiClient.post("/transfers", transferData);
        return response.data as TransferData;
    } catch (error) {
        console.warn(
            "Backend endpoint not available for creating transfer, using fallback behavior:",
            error,
        );
        return {
            id: `${transferData.type?.toUpperCase()}/OUT/${String(Date.now()).slice(-4)}`,
            type: transferData.type || "pickup",
            customer: transferData.customer || "New Customer",
            invoiceAddress: transferData.invoiceAddress || "",
            deliveryAddress: transferData.deliveryAddress || "",
            sourceLocation: transferData.sourceLocation || "Main Warehouse",
            scheduleDate:
                transferData.scheduleDate ||
                new Date().toISOString().split("T")[0],
            responsible: transferData.responsible || "Admin",
            transferType: transferData.transferType || "Delivery Order",
            status: "draft",
            transferLines: transferData.transferLines || [],
            untaxedTotal: 0,
            tax: 0,
            total: 0,
        };
    }
};

export const createReturn = async (
    returnData: Partial<ReturnData>,
): Promise<ReturnData> => {
    try {
        const response = await apiClient.post("/returns", returnData);
        return response.data as ReturnData;
    } catch (error) {
        console.warn(
            "Backend endpoint not available for creating return, using fallback behavior:",
            error,
        );
        return {
            id: `RETURN/IN/${String(Date.now()).slice(-4)}`,
            receivedFromCustomer: returnData.receivedFromCustomer || "Customer",
            pickupAddress: returnData.pickupAddress || "",
            destinationLocation:
                returnData.destinationLocation || "Main Warehouse",
            scheduleDate:
                returnData.scheduleDate ||
                new Date().toISOString().split("T")[0],
            responsible: returnData.responsible || "Admin",
            transferType: returnData.transferType || "Return Order",
            status: "draft",
            transferLines: returnData.transferLines || [],
            untaxedTotal: 0,
            tax: 0,
            total: 0,
        };
    }
};
