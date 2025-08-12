"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@client/components/ui/button";
import { Input } from "@client/components/ui/input";
import { Label } from "@client/components/ui/label";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Package,
    ArrowUpDown,
    ArrowDownUp,
    Eye,
    Filter,
    X,
    Upload,
    ImageIcon,
} from "lucide-react";
import {
    getProducts,
    getTransfers,
    getReturns,
    createProduct,
    createTransfer,
    createReturn,
    updateProduct,
    deleteProduct,
    getAttachmentsByProduct,
    uploadProductImage,
    deleteAttachment,
    // New API functions
    type ProductData,
    type CreateProductRequest,
    type UpdateProductRequest,
    type TransferData,
    type ReturnData,
    type AttachmentData,
} from "@client/app/admin/products/api";

// Form interface for legacy compatibility
interface ProductFormData {
    name: string;
    description: string;
    category: string;
    unitPrice: number;
    rentalPeriod: "daily" | "weekly" | "monthly";
    stockQuantity: number;
    rentalPricing: {
        extraHour: number;
        extraDay: number;
        priceList: number;
    };
}

// Convert between new API format and form format
const convertProductToForm = (product: ProductData): ProductFormData => ({
    name: product.name,
    description: product.description || "",
    category: product.category || "General",
    unitPrice: product.price,
    rentalPeriod: "daily",
    stockQuantity: product.quantity,
    rentalPricing: {
        extraHour: 0,
        extraDay: 0,
        priceList: product.price,
    },
});

const convertFormToCreateRequest = (
    formData: ProductFormData,
): CreateProductRequest => {
    // Validate and clean the data
    const name = formData.name?.trim();
    const price = Number(formData.unitPrice);
    const quantity = Number(formData.stockQuantity);
    const description = formData.description?.trim();

    if (!name) {
        throw new Error("Product name is required");
    }
    if (isNaN(price) || price <= 0) {
        throw new Error("Product price must be a valid number greater than 0");
    }
    if (isNaN(quantity) || quantity <= 0) {
        throw new Error(
            "Product quantity must be a valid number greater than 0",
        );
    }

    return {
        name,
        price,
        description: description || "",
        quantity,
    };
};

const convertFormToUpdateRequest = (
    formData: Partial<ProductFormData>,
): UpdateProductRequest => {
    const result: UpdateProductRequest = {};

    if (formData.name !== undefined) {
        const name = formData.name.trim();
        if (!name) {
            throw new Error("Product name cannot be empty");
        }
        result.name = name;
    }

    if (formData.unitPrice !== undefined) {
        const price = Number(formData.unitPrice);
        if (isNaN(price) || price <= 0) {
            throw new Error(
                "Product price must be a valid number greater than 0",
            );
        }
        result.price = price;
    }

    if (formData.description !== undefined) {
        result.description = formData.description?.trim() || "";
    }

    if (formData.stockQuantity !== undefined) {
        const quantity = Number(formData.stockQuantity);
        if (isNaN(quantity) || quantity <= 0) {
            throw new Error(
                "Product quantity must be a valid number greater than 0",
            );
        }
        result.quantity = quantity;
    }

    return result;
};

// Generate legacy display fields for compatibility
const getProductAvailability = (
    product: ProductData,
): "available" | "rented" | "maintenance" => {
    return product.quantity > 0 ? "available" : "rented";
};
const AvailabilityBadge = ({
    status,
}: {
    status: "available" | "rented" | "maintenance";
}) => {
    const getStatusConfig = (
        status: "available" | "rented" | "maintenance",
    ) => {
        switch (status) {
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
                return { color: "bg-gray-100 text-gray-800", text: "Unknown" };
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

const StatusBadge = ({
    status,
}: {
    status: "draft" | "ready" | "done" | "waiting";
}) => {
    const getStatusConfig = (
        status: "draft" | "ready" | "done" | "waiting",
    ) => {
        switch (status) {
            case "draft":
                return { color: "bg-gray-100 text-gray-800", text: "Draft" };
            case "ready":
                return { color: "bg-blue-100 text-blue-800", text: "Ready" };
            case "waiting":
                return {
                    color: "bg-yellow-100 text-yellow-800",
                    text: "Waiting",
                };
            case "done":
                return { color: "bg-green-100 text-green-800", text: "Done" };
            default:
                return { color: "bg-gray-100 text-gray-800", text: "Unknown" };
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

// Image upload component
const ImageUpload = ({
    onImageUpload,
    currentImageUrl,
    productId,
}: {
    onImageUpload: (attachment: AttachmentData) => void;
    currentImageUrl?: string;
    productId?: string;
}) => {
    const [uploading, setUploading] = useState(false);
    const [attachments, setAttachments] = useState<AttachmentData[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const loadAttachments = React.useCallback(async () => {
        if (!productId) return;
        try {
            const productAttachments = await getAttachmentsByProduct(productId);
            setAttachments(productAttachments);
        } catch (error) {
            console.error("Failed to load attachments:", error);
        }
    }, [productId]);

    // Load existing attachments when productId changes
    React.useEffect(() => {
        if (productId) {
            void loadAttachments();
        }
    }, [productId, loadAttachments]);

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file || !productId) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
        }

        setUploading(true);
        try {
            // Upload file and get attachment data
            const attachment = await uploadProductImage(productId, file);

            // Refresh attachments list
            await loadAttachments();

            // Notify parent component
            onImageUpload(attachment);

            alert("Image uploaded successfully!");
        } catch (error) {
            console.error("Failed to upload image:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveAttachment = async (attachmentId: string) => {
        if (!confirm("Are you sure you want to remove this image?")) return;

        try {
            await deleteAttachment(attachmentId);
            await loadAttachments();
            alert("Image removed successfully!");
        } catch (error) {
            console.error("Failed to remove attachment:", error);
            alert("Failed to remove image. Please try again.");
        }
    };

    const handleUseAsMainImage = (attachment: AttachmentData) => {
        onImageUpload(attachment);
    };

    if (!productId) {
        return (
            <div className="space-y-4">
                <Label>Product Images</Label>
                <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                        Save the product first to upload images
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label>Product Images</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2"
                >
                    {uploading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4" />
                            Upload Image
                        </>
                    )}
                </Button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                    void handleFileSelect(e);
                }}
                className="hidden"
            />

            {/* Current main image preview */}
            {currentImageUrl && (
                <div className="relative">
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                        <Image
                            src={currentImageUrl}
                            alt="Product preview"
                            width={400}
                            height={200}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <Label className="text-sm text-gray-600 mt-1">
                        Main Product Image
                    </Label>
                </div>
            )}

            {/* Attachment gallery */}
            {attachments.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        All Product Images
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {attachments.map((attachment) => (
                            <div key={attachment.id} className="relative group">
                                <div className="w-full h-24 border border-gray-200 rounded-lg overflow-hidden">
                                    <Image
                                        src={attachment.fileUrl}
                                        alt={attachment.fileName}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleUseAsMainImage(attachment)
                                            }
                                            className="h-6 w-6 p-0 bg-white/90"
                                            title="Use as main image"
                                        >
                                            <ImageIcon className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                void handleRemoveAttachment(
                                                    attachment.id,
                                                );
                                            }}
                                            className="h-6 w-6 p-0 bg-white/90 text-red-600 hover:text-red-700"
                                            title="Remove image"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                    {attachment.fileName}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload area when no images */}
            {!currentImageUrl && attachments.length === 0 && (
                <div
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                        Click to upload product image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                    </p>
                </div>
            )}
        </div>
    );
};

// Product form component
const ProductForm = ({
    product,
    onSave,
    onCancel,
}: {
    product?: ProductData;
    onSave: (
        productData: CreateProductRequest | UpdateProductRequest,
    ) => void | Promise<void>;
    onCancel: () => void;
}) => {
    const [formData, setFormData] = useState<ProductFormData>(
        product
            ? convertProductToForm(product)
            : {
                  name: "",
                  description: "",
                  category: "",
                  unitPrice: 1,
                  rentalPeriod: "daily",
                  stockQuantity: 1,
                  rentalPricing: {
                      extraHour: 0,
                      extraDay: 0,
                      priceList: 1,
                  },
              },
    );

    const [mainImage, setMainImage] = useState<string>("");

    const handleImageUpload = (attachment: AttachmentData) => {
        setMainImage(attachment.fileUrl);
        // You could also save attachment.id to the product if needed
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (product) {
                void onSave(convertFormToUpdateRequest(formData));
            } else {
                void onSave(convertFormToCreateRequest(formData));
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Please check your input and try again.");
            }
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {product ? "Edit Product" : "Create Product"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* General Product Info */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">
                            General Product Info
                        </h4>

                        <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                value={formData.name || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                value={formData.description || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Enter product description"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                value={formData.category || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value,
                                    })
                                }
                                placeholder="Enter product category"
                            />
                        </div>

                        <div>
                            <Label htmlFor="stockQuantity">
                                Stock Quantity
                            </Label>
                            <Input
                                id="stockQuantity"
                                type="number"
                                value={formData.stockQuantity || 1}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        stockQuantity:
                                            parseInt(e.target.value) || 1,
                                    })
                                }
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    {/* Rental Pricing */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">
                            Rental Pricing
                        </h4>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <Label className="text-xs">Rental Period</Label>
                                <div className="text-xs text-gray-600">---</div>
                            </div>
                            <div>
                                <Label className="text-xs">Pricelist</Label>
                                <div className="text-xs text-gray-600">---</div>
                            </div>
                            <div>
                                <Label className="text-xs">Price</Label>
                                <div className="text-xs text-gray-600">---</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">
                                Rental Reservations charges
                            </h5>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="extraHour">
                                        Extra Hour
                                    </Label>
                                    <Input
                                        id="extraHour"
                                        type="number"
                                        value={
                                            formData.rentalPricing?.extraHour ||
                                            0
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                rentalPricing: {
                                                    ...formData.rentalPricing,
                                                    extraHour:
                                                        parseFloat(
                                                            e.target.value,
                                                        ) || 0,
                                                },
                                            })
                                        }
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                <span className="self-end pb-2 text-sm text-gray-600">
                                    Rs
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="extraDay">Extra Days</Label>
                                    <Input
                                        id="extraDay"
                                        type="number"
                                        value={
                                            formData.rentalPricing?.extraDay ||
                                            0
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                rentalPricing: {
                                                    ...formData.rentalPricing,
                                                    extraDay:
                                                        parseFloat(
                                                            e.target.value,
                                                        ) || 0,
                                                },
                                            })
                                        }
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                <span className="self-end pb-2 text-sm text-gray-600">
                                    Rs
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="unitPrice">
                                        Unit Price
                                    </Label>
                                    <Input
                                        id="unitPrice"
                                        type="number"
                                        value={formData.unitPrice || 0}
                                        onChange={(e) => {
                                            const price =
                                                parseFloat(e.target.value) || 0;
                                            setFormData({
                                                ...formData,
                                                unitPrice: price,
                                                rentalPricing: {
                                                    ...formData.rentalPricing,
                                                    priceList: price,
                                                },
                                            });
                                        }}
                                        step="0.01"
                                        min="0.01"
                                        required
                                    />
                                </div>
                                <span className="self-end pb-2 text-sm text-gray-600">
                                    Rs
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Upload Section */}
                <div className="pt-4 border-t">
                    <ImageUpload
                        onImageUpload={handleImageUpload}
                        currentImageUrl={mainImage}
                        productId={product?.id}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {product ? "Update" : "Create"} Product
                    </Button>
                </div>
            </form>
        </div>
    );
};

// Products table component
const ProductsTable = ({
    products,
    onEdit,
    onDelete,
    onView,
}: {
    products: ProductData[];
    onEdit: (product: ProductData) => void;
    onDelete: (productId: string) => void | Promise<void>;
    onView: (product: ProductData) => void;
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {product.description}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {product.category || "General"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    Rs {product.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {product.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <AvailabilityBadge
                                        status={getProductAvailability(product)}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onView(product)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(product)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                void onDelete(product.id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Transfer/Return table component
const TransferTable = ({
    transfers,
    onView,
    onEdit,
    onDelete,
}: {
    transfers: (TransferData | ReturnData)[];
    onView: (item: TransferData | ReturnData) => void;
    onEdit: (item: TransferData | ReturnData) => void;
    onDelete: (itemId: string) => void;
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Schedule Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Responsible
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transfers.map((item) => {
                            const customer =
                                "customer" in item
                                    ? item.customer
                                    : item.receivedFromCustomer;
                            return (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {customer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.scheduleDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.responsible}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        Rs {item.total.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onView(item)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onEdit(item)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    onDelete(item.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Main products page component
const ProductsPage = () => {
    const [activeTab, setActiveTab] = useState<
        "products" | "transfers" | "returns"
    >("products");
    const [products, setProducts] = useState<ProductData[]>([]);
    const [transfers, setTransfers] = useState<TransferData[]>([]);
    const [returns, setReturns] = useState<ReturnData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<
        ProductData | undefined
    >();

    // Load data on component mount
    useEffect(() => {
        void loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsData, transfersData, returnsData] =
                await Promise.all([
                    getProducts(),
                    getTransfers(),
                    getReturns(),
                ]);
            setProducts(productsData);
            setTransfers(transfersData);
            setReturns(returnsData);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = () => {
        setEditingProduct(undefined);
        setShowProductForm(true);
    };

    const handleEditProduct = (product: ProductData) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    const handleSaveProduct = async (
        productData: CreateProductRequest | UpdateProductRequest,
    ) => {
        try {
            if (editingProduct) {
                const updatedProduct = await updateProduct(
                    editingProduct.id,
                    productData as UpdateProductRequest,
                );
                setProducts((prev) =>
                    prev.map((p) =>
                        p.id === editingProduct.id ? updatedProduct : p,
                    ),
                );
                alert(`Product ${updatedProduct.name} updated successfully!`);
            } else {
                const newProduct = await createProduct(
                    productData as CreateProductRequest,
                );
                setProducts((prev) => [newProduct, ...prev]);
                alert(`Product ${newProduct.name} created successfully!`);
            }
            setShowProductForm(false);
            setEditingProduct(undefined);
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Failed to save product. Please try again.");
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        const product = products.find((p) => p.id === productId);
        if (
            product &&
            confirm(
                `Are you sure you want to delete product "${product.name}"?`,
            )
        ) {
            try {
                await deleteProduct(productId);
                setProducts((prev) => prev.filter((p) => p.id !== productId));
                alert(`Product "${product.name}" deleted successfully!`);
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert("Failed to delete product. Please try again.");
            }
        }
    };

    const handleViewProduct = (product: ProductData) => {
        alert(
            `Product Details:\n\nName: ${product.name}\nDescription: ${product.description || "N/A"}\nCategory: ${product.category || "General"}\nPrice: Rs ${product.price}\nStock: ${product.quantity}\nStatus: ${getProductAvailability(product)}`,
        );
    };

    const handleCreateTransfer = async () => {
        try {
            const newTransfer = await createTransfer({
                type: "pickup",
                customer: "New Customer",
                scheduleDate: new Date().toISOString().split("T")[0],
            });
            setTransfers((prev) => [newTransfer, ...prev]);
            alert(`Transfer ${newTransfer.id} created successfully!`);
        } catch (error) {
            console.error("Failed to create transfer:", error);
            alert("Failed to create transfer. Please try again.");
        }
    };

    const handleCreateReturn = async () => {
        try {
            const newReturn = await createReturn({
                receivedFromCustomer: "Customer",
                scheduleDate: new Date().toISOString().split("T")[0],
            });
            setReturns((prev) => [newReturn, ...prev]);
            alert(`Return ${newReturn.id} created successfully!`);
        } catch (error) {
            console.error("Failed to create return:", error);
            alert("Failed to create return. Please try again.");
        }
    };

    const handleViewTransfer = (item: TransferData | ReturnData) => {
        const customer =
            "customer" in item ? item.customer : item.receivedFromCustomer;
        alert(
            `${activeTab === "transfers" ? "Transfer" : "Return"} Details:\n\nID: ${item.id}\nCustomer: ${customer}\nSchedule Date: ${item.scheduleDate}\nResponsible: ${item.responsible}\nStatus: ${item.status}\nTotal: Rs ${item.total}`,
        );
    };

    const handleEditTransfer = (item: TransferData | ReturnData) => {
        alert(
            `Edit functionality for ${item.id} will be implemented in a detailed form.`,
        );
    };

    const handleDeleteTransfer = (itemId: string) => {
        const isTransfer = transfers.some((t) => t.id === itemId);
        if (isTransfer) {
            const transfer = transfers.find((t) => t.id === itemId);
            if (
                transfer &&
                confirm(`Are you sure you want to delete transfer ${itemId}?`)
            ) {
                setTransfers((prev) => prev.filter((t) => t.id !== itemId));
                alert(`Transfer ${itemId} deleted successfully!`);
            }
        } else {
            const returnItem = returns.find((r) => r.id === itemId);
            if (
                returnItem &&
                confirm(`Are you sure you want to delete return ${itemId}?`)
            ) {
                setReturns((prev) => prev.filter((r) => r.id !== itemId));
                alert(`Return ${itemId} deleted successfully!`);
            }
        }
    };

    // Filter data based on search term
    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (product.description || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const filteredTransfers = transfers.filter(
        (transfer) =>
            transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transfer.customer
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            transfer.responsible
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const filteredReturns = returns.filter(
        (returnItem) =>
            returnItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            returnItem.receivedFromCustomer
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            returnItem.responsible
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Products Management
                    </h1>
                    <p className="text-gray-600">
                        Manage products, transfers, and returns
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {activeTab === "products" && (
                        <Button
                            onClick={handleCreateProduct}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            New Product
                        </Button>
                    )}
                    {activeTab === "transfers" && (
                        <Button
                            onClick={() => {
                                void handleCreateTransfer();
                            }}
                            className="flex items-center gap-2"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                            New Transfer
                        </Button>
                    )}
                    {activeTab === "returns" && (
                        <Button
                            onClick={() => {
                                void handleCreateReturn();
                            }}
                            className="flex items-center gap-2"
                        >
                            <ArrowDownUp className="h-4 w-4" />
                            New Return
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "products"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <Package className="h-4 w-4 inline mr-2" />
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab("transfers")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "transfers"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <ArrowUpDown className="h-4 w-4 inline mr-2" />
                        Transfers
                    </button>
                    <button
                        onClick={() => setActiveTab("returns")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "returns"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <ArrowDownUp className="h-4 w-4 inline mr-2" />
                        Returns
                    </button>
                </nav>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80">
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
                </div>
            </div>

            {/* Content */}
            {showProductForm ? (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSaveProduct}
                    onCancel={() => {
                        setShowProductForm(false);
                        setEditingProduct(undefined);
                    }}
                />
            ) : (
                <>
                    {activeTab === "products" && (
                        <ProductsTable
                            products={filteredProducts}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                            onView={handleViewProduct}
                        />
                    )}

                    {activeTab === "transfers" && (
                        <TransferTable
                            transfers={filteredTransfers}
                            onView={handleViewTransfer}
                            onEdit={handleEditTransfer}
                            onDelete={handleDeleteTransfer}
                        />
                    )}

                    {activeTab === "returns" && (
                        <TransferTable
                            transfers={filteredReturns}
                            onView={handleViewTransfer}
                            onEdit={handleEditTransfer}
                            onDelete={handleDeleteTransfer}
                        />
                    )}
                </>
            )}

            {/* Empty states */}
            {!showProductForm && (
                <>
                    {activeTab === "products" &&
                        filteredProducts.length === 0 && (
                            <div className="text-center py-12">
                                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm
                                        ? "Try adjusting your search terms"
                                        : "Get started by creating your first product"}
                                </p>
                                {!searchTerm && (
                                    <Button
                                        onClick={handleCreateProduct}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Create First Product
                                    </Button>
                                )}
                            </div>
                        )}

                    {activeTab === "transfers" &&
                        filteredTransfers.length === 0 && (
                            <div className="text-center py-12">
                                <ArrowUpDown className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No transfers found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm
                                        ? "Try adjusting your search terms"
                                        : "Get started by creating your first transfer"}
                                </p>
                                {!searchTerm && (
                                    <Button
                                        onClick={() => {
                                            void handleCreateTransfer();
                                        }}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Create First Transfer
                                    </Button>
                                )}
                            </div>
                        )}

                    {activeTab === "returns" &&
                        filteredReturns.length === 0 && (
                            <div className="text-center py-12">
                                <ArrowDownUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No returns found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm
                                        ? "Try adjusting your search terms"
                                        : "Get started by creating your first return"}
                                </p>
                                {!searchTerm && (
                                    <Button
                                        onClick={() => {
                                            void handleCreateReturn();
                                        }}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Create First Return
                                    </Button>
                                )}
                            </div>
                        )}
                </>
            )}
        </div>
    );
};

export default ProductsPage;
