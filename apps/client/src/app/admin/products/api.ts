import axios from "../../../lib/axios";

/**
 * Products API Module
 *
 * This module provides functions to interact with the products endpoints:
 * - GET /api/v1/products - Get all products
 * - GET /api/v1/products/{id} - Get a product by id
 * - POST /api/v1/products - Create a new product
 * - PUT /api/v1/products/{id} - Update a product
 * - DELETE /api/v1/products/{id} - Delete a product
 *
 * Base URL: http://35.222.216.48:4001
 */

// Types for product data - Updated to match backend API
export interface ProductData {
    id: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    category?: string;
    termsAndConditions?: string;
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Create DTO for backend API
export interface CreateProductRequest {
    name: string;
    price: number;
    description?: string;
    quantity: number;
}

// Update DTO for backend API
export interface UpdateProductRequest {
    name?: string;
    price?: number;
    description?: string;
    quantity?: number;
}

// Legacy interface for backward compatibility
export interface LegacyProductData {
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

// Helper functions to convert between formats
export const convertToLegacyFormat = (
    product: ProductData,
): LegacyProductData => ({
    id: product.id,
    name: product.name,
    description: product.description || "",
    category: product.category || "General",
    unitPrice: product.price,
    rentalPeriod: "daily",
    availability: product.quantity > 0 ? "available" : "rented",
    stockQuantity: product.quantity,
    rentalPricing: {
        extraHour: 0,
        extraDay: 0,
        priceList: product.price,
    },
});

export const convertFromLegacyFormat = (
    legacy: LegacyProductData,
): ProductData => ({
    id: legacy.id,
    name: legacy.name,
    description: legacy.description,
    price: legacy.unitPrice,
    quantity: legacy.stockQuantity,
    category: legacy.category,
    imageUrl: "",
});

export const convertLegacyCreateRequest = (
    legacy: Partial<LegacyProductData>,
): CreateProductRequest => ({
    name: legacy.name || "New Product",
    price: legacy.unitPrice || 0,
    description: legacy.description || "",
    quantity: legacy.stockQuantity || 1,
});

export const convertLegacyUpdateRequest = (
    legacy: Partial<LegacyProductData>,
): UpdateProductRequest => ({
    ...(legacy.name && { name: legacy.name }),
    ...(legacy.unitPrice !== undefined && { price: legacy.unitPrice }),
    ...(legacy.description && { description: legacy.description }),
    ...(legacy.stockQuantity !== undefined && {
        quantity: legacy.stockQuantity,
    }),
});

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

// Attachment interface matching the backend model
export interface AttachmentData {
    id: string;
    productId: string;
    appwriteFileId: string;
    fileName: string;
    fileSize: number;
    fileUrl: string;
    mimeType?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Fallback/dummy data - Updated to match backend API
const FALLBACK_PRODUCTS: ProductData[] = [
    {
        id: "P001",
        name: "Excavator 20T",
        description: "Heavy duty excavator for construction projects",
        category: "Heavy Machinery",
        price: 500,
        quantity: 3,
        imageUrl: "",
    },
    {
        id: "P002",
        name: "Concrete Mixer",
        description: "Industrial concrete mixer for large projects",
        category: "Construction Equipment",
        price: 150,
        quantity: 5,
        imageUrl: "",
    },
    {
        id: "P003",
        name: "Tower Crane",
        description: "High-capacity tower crane for building construction",
        category: "Lifting Equipment",
        price: 800,
        quantity: 2,
        imageUrl: "",
    },
    {
        id: "P004",
        name: "Forklift 5T",
        description: "Electric forklift for warehouse operations",
        category: "Material Handling",
        price: 200,
        quantity: 4,
        imageUrl: "",
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
        const response = await axios.get("/api/v1/products");
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
        const response = await axios.get(`/api/v1/products/${productId}`);
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
    productData: CreateProductRequest,
): Promise<ProductData> => {
    try {
        // Validate required fields on client side
        if (!productData.name || productData.name.trim() === "") {
            throw new Error("Product name is required");
        }
        if (!productData.price || productData.price <= 0) {
            throw new Error("Product price must be greater than 0");
        }
        if (!productData.quantity || productData.quantity <= 0) {
            throw new Error("Product quantity must be greater than 0");
        }

        // Ensure numeric fields are properly typed
        const cleanedData = {
            name: productData.name.trim(),
            price: Number(productData.price),
            description: productData.description?.trim() || "",
            quantity: Number(productData.quantity),
        };

        console.log("Sending product data:", cleanedData);

        const response = await axios.post("/api/v1/products", cleanedData);
        return response.data as ProductData;
    } catch (error) {
        console.error("Error creating product:", error);
        if (error instanceof Error && error.message.includes("required")) {
            throw error; // Re-throw validation errors
        }
        console.warn(
            "Backend endpoint not available for creating product, using fallback behavior:",
            error,
        );
        return {
            id: `P${String(Date.now()).slice(-3)}`,
            name: productData.name || "New Product",
            description: productData.description || "",
            price: productData.price || 0,
            quantity: productData.quantity || 1,
            category: "General",
            imageUrl: "",
        };
    }
};

export const updateProduct = async (
    productId: string,
    productData: UpdateProductRequest,
): Promise<ProductData> => {
    try {
        // Validate fields if they are provided
        if (
            productData.name !== undefined &&
            (!productData.name || productData.name.trim() === "")
        ) {
            throw new Error("Product name cannot be empty");
        }
        if (productData.price !== undefined && productData.price <= 0) {
            throw new Error("Product price must be greater than 0");
        }
        if (productData.quantity !== undefined && productData.quantity <= 0) {
            throw new Error("Product quantity must be greater than 0");
        }

        // Clean the data
        const cleanedData: UpdateProductRequest = {};
        if (productData.name !== undefined) {
            cleanedData.name = productData.name.trim();
        }
        if (productData.price !== undefined) {
            cleanedData.price = Number(productData.price);
        }
        if (productData.description !== undefined) {
            cleanedData.description = productData.description?.trim() || "";
        }
        if (productData.quantity !== undefined) {
            cleanedData.quantity = Number(productData.quantity);
        }

        console.log("Updating product with data:", cleanedData);

        const response = await axios.put(
            `/api/v1/products/${productId}`,
            cleanedData,
        );
        return response.data as ProductData;
    } catch (error) {
        console.error("Error updating product:", error);
        if (
            error instanceof Error &&
            (error.message.includes("empty") ||
                error.message.includes("greater than"))
        ) {
            throw error; // Re-throw validation errors
        }
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
        await axios.delete(`/api/v1/products/${productId}`);
    } catch (error) {
        console.warn(
            `Backend endpoint not available for deleting product ${productId}, using fallback behavior:`,
            error,
        );
    }
};

// Legacy-compatible wrapper functions for backward compatibility
export const getProductsLegacy = async (): Promise<LegacyProductData[]> => {
    const products = await getProducts();
    return products.map(convertToLegacyFormat);
};

export const getProductByIdLegacy = async (
    productId: string,
): Promise<LegacyProductData> => {
    const product = await getProductById(productId);
    return convertToLegacyFormat(product);
};

export const createProductLegacy = async (
    productData: Partial<LegacyProductData>,
): Promise<LegacyProductData> => {
    const createRequest = convertLegacyCreateRequest(productData);
    const product = await createProduct(createRequest);
    return convertToLegacyFormat(product);
};

export const updateProductLegacy = async (
    productId: string,
    productData: Partial<LegacyProductData>,
): Promise<LegacyProductData> => {
    const updateRequest = convertLegacyUpdateRequest(productData);
    const product = await updateProduct(productId, updateRequest);
    return convertToLegacyFormat(product);
};

export const getTransfers = async (): Promise<TransferData[]> => {
    try {
        const response = await axios.get("/transfers");
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
        const response = await axios.get("/returns");
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
        const response = await axios.post("/transfers", transferData);
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
        const response = await axios.post("/returns", returnData);
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

// Attachment API functions
export const getAttachmentsByProduct = async (
    productId: string,
): Promise<AttachmentData[]> => {
    try {
        const response = await axios.get(`/attachments/product/${productId}`);
        return response.data as AttachmentData[];
    } catch (error) {
        console.warn(
            `Backend endpoint not available for product ${productId} attachments, using fallback data:`,
            error,
        );
        return [];
    }
};

export const uploadProductImage = async (
    productId: string,
    file: File,
): Promise<AttachmentData> => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("productId", productId);

        const response = await axios.post("/attachments", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data as AttachmentData;
    } catch (error) {
        console.warn(
            "Backend endpoint not available for uploading image, using fallback behavior:",
            error,
        );
        // Create a fallback attachment object
        return {
            id: `ATT${String(Date.now()).slice(-3)}`,
            productId: productId,
            appwriteFileId: `fallback_${Date.now()}`,
            fileName: file.name,
            fileSize: file.size,
            fileUrl: URL.createObjectURL(file), // Create temporary URL for demo
            mimeType: file.type,
            createdAt: new Date().toISOString(),
        };
    }
};

export const deleteAttachment = async (attachmentId: string): Promise<void> => {
    try {
        await axios.delete(`/attachments/${attachmentId}`);
    } catch (error) {
        console.warn(
            `Backend endpoint not available for deleting attachment ${attachmentId}, using fallback behavior:`,
            error,
        );
    }
};
