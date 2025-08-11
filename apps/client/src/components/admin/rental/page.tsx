"use client";

// /api/v1/rentals
// ├── GET    - List all rentals (with pagination)
// ├── POST   - Create new rental
// └── [id]/
//     ├── GET    - Get single rental with order lines
//     ├── PUT    - Update rental fields
//     ├── DELETE - Delete rental
//     ├── actions/
//     │   └── POST - Perform actions (send/print/confirm/cancel)
//     └── order-lines/
//         ├── GET  - Get order lines for rental
//         ├── POST - Add new order line
//         └── [lineId]/
//             ├── GET    - Get single order line
//             ├── PUT    - Update order line
//             └── DELETE - Remove order line

import React, { useState, useEffect } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Send,
    Printer,
    Check,
    X,
    Edit,
    MoreHorizontal,
    Info,
} from "lucide-react";
import { Input } from "@client/components/ui/input";
import { Button } from "@client/components/ui/button";
import { cn } from "@client/lib/utils";
import { useMobileMenu } from "@client/components/admin/common";
import {
    getRentalData,
    updateRentalData,
    updateRentalStatus,
    addOrderLine,
    updateOrderLine,
    deleteOrderLine,
    type RentalFormData,
    type RentalOrderLine,
} from "@client/app/admin/rental/api";

interface StatusBadgeProps {
    status: RentalFormData["status"];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusConfig = (status: RentalFormData["status"]) => {
        switch (status) {
            case "draft":
                return {
                    label: "Draft",
                    className: "bg-gray-100 text-gray-800",
                };
            case "quotation_sent":
                return {
                    label: "Quotation sent",
                    className: "bg-yellow-100 text-yellow-800",
                };
            case "confirmed":
                return {
                    label: "Confirmed",
                    className: "bg-green-100 text-green-800",
                };
            case "cancelled":
                return {
                    label: "Cancelled",
                    className: "bg-red-100 text-red-800",
                };
            default:
                return {
                    label: "Unknown",
                    className: "bg-gray-100 text-gray-800",
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                config.className,
            )}
        >
            {config.label}
        </span>
    );
};

const FormField: React.FC<{
    label: string;
    value: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}> = ({ label, value, onChange, disabled = false, placeholder, className }) => (
    <div className={cn("space-y-1", className)}>
        <label className="text-sm font-medium text-gray-700">{label} :</label>
        <Input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className="h-8 text-sm"
        />
    </div>
);

const OrderLineItem: React.FC<{
    orderLine: RentalOrderLine;
    onEdit?: () => void;
    onRemove?: () => void;
}> = ({ orderLine, onEdit, onRemove }) => (
    <tr className="border-b hover:bg-gray-50">
        <td className="px-4 py-3 text-sm text-gray-900">{orderLine.product}</td>
        <td className="px-4 py-3 text-sm text-gray-900 text-center">
            {orderLine.quantity}
        </td>
        <td className="px-4 py-3 text-sm text-gray-900 text-center">
            {orderLine.unitPrice}
        </td>
        <td className="px-4 py-3 text-sm text-gray-900 text-center">
            {orderLine.tax}
        </td>
        <td className="px-4 py-3 text-sm text-gray-900 text-center">
            {orderLine.subTotal}
        </td>
        <td className="px-4 py-3 text-sm text-gray-900 text-center">
            <div className="flex items-center justify-center gap-1">
                <Button size="sm" variant="ghost" onClick={onEdit}>
                    <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={onRemove}>
                    <X className="h-3 w-3" />
                </Button>
            </div>
        </td>
    </tr>
);

export default function RentalPage() {
    const [rentalData, setRentalData] = useState<RentalFormData | null>(null);
    const [orderLines, setOrderLines] = useState<RentalOrderLine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(80);
    const [activeTab, setActiveTab] = useState<
        "order-lines" | "other-details" | "rental-notes"
    >("order-lines");
    const [termsAndConditions, setTermsAndConditions] = useState("");
    const [editingOrderLine, setEditingOrderLine] = useState<{
        index: number;
        line: RentalOrderLine;
    } | null>(null);
    const { MobileMenuButton } = useMobileMenu();

    // Load rental data on component mount
    useEffect(() => {
        const fetchRentalData = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("Fetching rental data from API...");
                const data = await getRentalData("R0001"); // Default to R0001
                setRentalData(data.rental);
                setOrderLines(data.orderLines);
                setTermsAndConditions(data.termsAndConditions);
                setCurrentPage(data.pagination.currentPage);
                setTotalPages(data.pagination.totalPages);
            } catch (err) {
                console.error("Failed to fetch rental data:", err);
                setError("Failed to load rental data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        void fetchRentalData();
    }, []);

    const updateRentalField = async (
        field: keyof RentalFormData,
        value: string,
    ) => {
        if (!rentalData) return;

        try {
            const updatedRental = await updateRentalData(rentalData.id, {
                [field]: value,
            });
            setRentalData(updatedRental);
        } catch (err) {
            console.error("Failed to update rental field:", err);
            // Still update local state for fallback behavior
            setRentalData((prev) =>
                prev ? { ...prev, [field]: value } : null,
            );
        }
    };

    const calculateTotals = () => {
        const untaxedTotal = orderLines.reduce(
            (sum, line) => sum + line.subTotal,
            0,
        );
        const totalTax = orderLines.reduce((sum, line) => sum + line.tax, 0);
        const total = untaxedTotal + totalTax;
        return { untaxedTotal, totalTax, total };
    };

    const { untaxedTotal, totalTax, total } = calculateTotals();

    // PDF Generation function
    const generatePDF = () => {
        if (!rentalData) return;

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Rental Order - ${rentalData.id}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 40px; 
                        color: #333; 
                        line-height: 1.6; 
                    }
                    .header { 
                        border-bottom: 3px solid #2563eb; 
                        padding-bottom: 20px; 
                        margin-bottom: 30px; 
                    }
                    .header h1 { 
                        color: #2563eb; 
                        margin: 0; 
                        font-size: 28px; 
                    }
                    .status { 
                        display: inline-block; 
                        padding: 6px 12px; 
                        border-radius: 20px; 
                        font-size: 12px; 
                        font-weight: 600; 
                        text-transform: uppercase; 
                        margin-top: 10px;
                    }
                    .status.quotation_sent { background: #fef3c7; color: #92400e; }
                    .status.confirmed { background: #dcfce7; color: #166534; }
                    .status.draft { background: #f3f4f6; color: #374151; }
                    .status.cancelled { background: #fee2e2; color: #991b1b; }
                    .info-grid { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 30px; 
                        margin-bottom: 30px; 
                    }
                    .info-item { 
                        margin-bottom: 15px; 
                    }
                    .info-label { 
                        font-weight: 600; 
                        color: #6b7280; 
                        display: block; 
                        margin-bottom: 5px; 
                    }
                    .info-value { 
                        color: #111827; 
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 30px 0; 
                    }
                    th, td { 
                        padding: 12px; 
                        text-align: left; 
                        border-bottom: 1px solid #e5e7eb; 
                    }
                    th { 
                        background: #f9fafb; 
                        font-weight: 600; 
                        color: #374151; 
                    }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .totals { 
                        float: right; 
                        width: 300px; 
                        margin-top: 20px; 
                    }
                    .totals-row { 
                        display: flex; 
                        justify-content: space-between; 
                        padding: 8px 0; 
                    }
                    .totals-total { 
                        border-top: 2px solid #374151; 
                        font-weight: 700; 
                        font-size: 16px; 
                    }
                    .terms { 
                        margin-top: 40px; 
                        padding-top: 20px; 
                        border-top: 1px solid #e5e7eb; 
                    }
                    .terms h3 { 
                        color: #374151; 
                        margin-bottom: 10px; 
                    }
                    .terms-content { 
                        white-space: pre-line; 
                        color: #6b7280; 
                        font-size: 14px; 
                    }
                    @media print {
                        body { margin: 20px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Rental Order ${rentalData.id}</h1>
                    <span class="status ${rentalData.status}">${rentalData.status.replace("_", " ")}</span>
                </div>
                
                <div class="info-grid">
                    <div>
                        <div class="info-item">
                            <span class="info-label">Customer:</span>
                            <span class="info-value">${rentalData.customer}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Invoice Address:</span>
                            <span class="info-value">${rentalData.invoiceAddress}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Delivery Address:</span>
                            <span class="info-value">${rentalData.deliveryAddress}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Rental Template:</span>
                            <span class="info-value">${rentalData.rentalTemplate}</span>
                        </div>
                    </div>
                    <div>
                        <div class="info-item">
                            <span class="info-label">Expiration:</span>
                            <span class="info-value">${rentalData.expiration}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Order Date:</span>
                            <span class="info-value">${rentalData.rentalOrderDate}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Price List:</span>
                            <span class="info-value">${rentalData.priceList}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Rental Period:</span>
                            <span class="info-value">${rentalData.rentalPeriod}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Duration:</span>
                            <span class="info-value">${rentalData.rentalDuration}</span>
                        </div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th class="text-center">Quantity</th>
                            <th class="text-center">Unit Price</th>
                            <th class="text-center">Tax</th>
                            <th class="text-center">Sub Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderLines
                            .map(
                                (line) => `
                            <tr>
                                <td>${line.product}</td>
                                <td class="text-center">${line.quantity}</td>
                                <td class="text-center">${line.unitPrice.toLocaleString()}</td>
                                <td class="text-center">${line.tax.toLocaleString()}</td>
                                <td class="text-center">${line.subTotal.toLocaleString()}</td>
                            </tr>
                        `,
                            )
                            .join("")}
                    </tbody>
                </table>

                <div style="clear: both;">
                    <div class="totals">
                        <div class="totals-row">
                            <span>Untaxed Total:</span>
                            <span>${untaxedTotal.toLocaleString()}</span>
                        </div>
                        <div class="totals-row">
                            <span>Tax:</span>
                            <span>${totalTax.toLocaleString()}</span>
                        </div>
                        <div class="totals-row totals-total">
                            <span>Total:</span>
                            <span>${total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                ${
                    termsAndConditions
                        ? `
                    <div class="terms">
                        <h3>Terms & Conditions</h3>
                        <div class="terms-content">${termsAndConditions}</div>
                    </div>
                `
                        : ""
                }

                <button class="no-print" onclick="window.print()" style="
                    position: fixed; 
                    top: 20px; 
                    right: 20px; 
                    background: #2563eb; 
                    color: white; 
                    border: none; 
                    padding: 10px 20px; 
                    border-radius: 6px; 
                    cursor: pointer;
                    font-weight: 600;
                ">Print PDF</button>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
    };

    // Add new order line
    const handleAddProduct = async () => {
        if (!rentalData) return;

        const newOrderLine = {
            product: "New Product",
            quantity: 1,
            unitPrice: 100,
            tax: 10,
            subTotal: 110,
        };

        try {
            const addedLine = await addOrderLine(rentalData.id, newOrderLine);
            setOrderLines((prev) => [...prev, addedLine]);
        } catch (err) {
            console.error("Failed to add order line:", err);
        }
    };

    // Edit order line
    const handleEditOrderLine = (index: number, line: RentalOrderLine) => {
        setEditingOrderLine({ index, line });
    };

    // Update order line
    const handleUpdateOrderLine = async (
        index: number,
        updates: Partial<RentalOrderLine>,
    ) => {
        if (!rentalData) return;

        const currentLine = orderLines[index];
        const updatedLine = { ...currentLine, ...updates };

        // Recalculate subtotal if quantity or price changed
        if (updates.quantity !== undefined || updates.unitPrice !== undefined) {
            updatedLine.subTotal =
                updatedLine.quantity * updatedLine.unitPrice + updatedLine.tax;
        }

        try {
            const updated = await updateOrderLine(
                rentalData.id,
                currentLine.id,
                updatedLine,
            );
            setOrderLines((prev) =>
                prev.map((line, i) => (i === index ? updated : line)),
            );
        } catch (err) {
            console.error("Failed to update order line:", err);
            // Update local state anyway for fallback
            setOrderLines((prev) =>
                prev.map((line, i) => (i === index ? updatedLine : line)),
            );
        }
    };

    // Remove order line
    const handleRemoveOrderLine = async (index: number) => {
        if (!rentalData) return;

        const lineToRemove = orderLines[index];

        try {
            await deleteOrderLine(rentalData.id, lineToRemove.id);
            setOrderLines((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            console.error("Failed to remove order line:", err);
            // Remove from local state anyway for fallback
            setOrderLines((prev) => prev.filter((_, i) => i !== index));
        }
    };

    // Update prices based on price list
    const handleUpdatePrices = async () => {
        if (!rentalData) return;

        try {
            // Simulate price update by adding 10% to all unit prices
            const updatedLines = orderLines.map((line) => ({
                ...line,
                unitPrice: Math.round(line.unitPrice * 1.1),
                subTotal: Math.round(
                    line.unitPrice * 1.1 * line.quantity + line.tax,
                ),
            }));

            // Update all lines
            const updatePromises = updatedLines.map((line) =>
                updateOrderLine(rentalData.id, line.id, {
                    unitPrice: line.unitPrice,
                    subTotal: line.subTotal,
                }),
            );

            await Promise.all(updatePromises);
            setOrderLines(updatedLines);

            // Show success message
            console.log("Prices updated successfully!");
        } catch (err) {
            console.error("Failed to update prices:", err);
        }
    };

    // Create new rental
    const handleCreateNew = () => {
        // For now, just reload with a new ID
        // In a real app, this would navigate to a new rental form
        window.location.href = "/admin/rental?new=true";
    };

    const handleStatusAction = async (action: string) => {
        if (!rentalData) return;

        try {
            console.log(
                `Performing action: ${action} on rental ${rentalData.id}`,
            );
            const updatedRental = await updateRentalStatus(
                rentalData.id,
                action as "send" | "print" | "confirm" | "cancel",
            );
            setRentalData(updatedRental);
        } catch (err) {
            console.error(`Failed to perform action ${action}:`, err);
            // Action failed, but continue with current state
        }
    };

    const isConfirmed = rentalData?.status === "confirmed";

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col h-full bg-gray-50">
                <header className="bg-white border-b px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="md:hidden">
                                <MobileMenuButton />
                            </div>
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Rental Orders
                            </h1>
                        </div>
                    </div>
                </header>
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-lg text-gray-600 mb-2">
                            Loading rental data...
                        </div>
                        <div className="text-sm text-gray-500">
                            Fetching data from backend API
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col h-full bg-gray-50">
                <header className="bg-white border-b px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="md:hidden">
                                <MobileMenuButton />
                            </div>
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Rental Orders
                            </h1>
                        </div>
                    </div>
                </header>
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-lg text-red-600 mb-2">{error}</div>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    // No data state
    if (!rentalData) {
        return (
            <div className="flex flex-col h-full bg-gray-50">
                <header className="bg-white border-b px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="md:hidden">
                                <MobileMenuButton />
                            </div>
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Rental Orders
                            </h1>
                        </div>
                    </div>
                </header>
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-lg text-gray-600 mb-2">
                            No rental data available
                        </div>
                        <div className="text-sm text-gray-500">
                            Please try refreshing the page
                        </div>
                    </div>
                </main>
            </div>
        );
    }

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
                            Rental Orders
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCreateNew}
                        >
                            <Plus className="h-4 w-4" />
                            Create
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6">
                {/* Backend Status Banner */}
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-blue-800">
                        <Info className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">
                            <strong>Development Mode:</strong> Currently using
                            fallback rental data. Backend API endpoints are
                            ready to be implemented at{" "}
                            <code className="bg-blue-100 px-1 rounded text-xs">
                                localhost:3001/api/v1/rentals
                            </code>
                        </span>
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            {currentPage}/{totalPages}
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    setCurrentPage(Math.max(1, currentPage - 1))
                                }
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    setCurrentPage(
                                        Math.min(totalPages, currentPage + 1),
                                    )
                                }
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Rental Form */}
                <div className="bg-white rounded-lg border shadow-sm">
                    {/* Form Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {rentalData.id}
                            </h2>
                            <StatusBadge status={rentalData.status} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => void handleStatusAction("send")}
                                disabled={isConfirmed}
                            >
                                <Send className="h-4 w-4" />
                                Send
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={generatePDF}
                            >
                                <Printer className="h-4 w-4" />
                                Print
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    void handleStatusAction("confirm")
                                }
                                disabled={isConfirmed}
                            >
                                <Check className="h-4 w-4" />
                                Confirm
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    void handleStatusAction("cancel")
                                }
                                disabled={isConfirmed}
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                            <Button size="sm" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-6">
                        {/* Customer Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <FormField
                                    label="Customer"
                                    value={rentalData.customer}
                                    onChange={(value) =>
                                        void updateRentalField(
                                            "customer",
                                            value,
                                        )
                                    }
                                    placeholder="Select customer..."
                                />
                                <FormField
                                    label="Invoice Address"
                                    value={rentalData.invoiceAddress}
                                    onChange={(value) =>
                                        void updateRentalField(
                                            "invoiceAddress",
                                            value,
                                        )
                                    }
                                    placeholder="Enter invoice address..."
                                />
                                <FormField
                                    label="Delivery Address"
                                    value={rentalData.deliveryAddress}
                                    onChange={(value) =>
                                        void updateRentalField(
                                            "deliveryAddress",
                                            value,
                                        )
                                    }
                                    placeholder="Enter delivery address..."
                                />
                                <FormField
                                    label="Rental Template"
                                    value={rentalData.rentalTemplate}
                                    onChange={(value) =>
                                        void updateRentalField(
                                            "rentalTemplate",
                                            value,
                                        )
                                    }
                                    placeholder="Select rental template..."
                                />
                            </div>
                            <div className="space-y-4">
                                <FormField
                                    label="Expiration"
                                    value={rentalData.expiration}
                                    onChange={(value) =>
                                        void updateRentalField(
                                            "expiration",
                                            value,
                                        )
                                    }
                                    placeholder="Select expiration date..."
                                />
                                <FormField
                                    label="Rental Order Date"
                                    value={rentalData.rentalOrderDate}
                                    onChange={(value) =>
                                        void updateRentalField(
                                            "rentalOrderDate",
                                            value,
                                        )
                                    }
                                    placeholder="Select order date..."
                                />
                                <FormField
                                    label="PriceList"
                                    value={rentalData.priceList}
                                    onChange={(value) =>
                                        void updateRentalField(
                                            "priceList",
                                            value,
                                        )
                                    }
                                    placeholder="Select price list..."
                                />
                                <FormField
                                    label="Rental Period"
                                    value={rentalData.rentalPeriod}
                                    onChange={(value) =>
                                        void updateRentalField(
                                            "rentalPeriod",
                                            value,
                                        )
                                    }
                                    placeholder="Enter rental period..."
                                />
                                <FormField
                                    label="Rental Duration"
                                    value={rentalData.rentalDuration}
                                    onChange={(value) =>
                                        void updateRentalField(
                                            "rentalDuration",
                                            value,
                                        )
                                    }
                                    placeholder="Enter rental duration..."
                                />
                                <div className="pt-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={isConfirmed}
                                        onClick={() =>
                                            void handleUpdatePrices()
                                        }
                                    >
                                        Update Prices
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab("order-lines")}
                                    className={cn(
                                        "py-2 px-1 border-b-2 font-medium text-sm",
                                        activeTab === "order-lines"
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                    )}
                                >
                                    Order lines
                                </button>
                                <button
                                    onClick={() =>
                                        setActiveTab("other-details")
                                    }
                                    className={cn(
                                        "py-2 px-1 border-b-2 font-medium text-sm",
                                        activeTab === "other-details"
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                    )}
                                >
                                    Other details
                                </button>
                                <button
                                    onClick={() => setActiveTab("rental-notes")}
                                    className={cn(
                                        "py-2 px-1 border-b-2 font-medium text-sm",
                                        activeTab === "rental-notes"
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                    )}
                                >
                                    Rental Notes
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        {activeTab === "order-lines" && (
                            <div className="space-y-6">
                                {/* Order Lines Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200">
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                                    Product
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                                                    Quantity
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                                                    Unit Price
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                                                    Tax
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                                                    Sub Total
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderLines.map((line, index) => (
                                                <OrderLineItem
                                                    key={index}
                                                    orderLine={line}
                                                    onEdit={() =>
                                                        handleEditOrderLine(
                                                            index,
                                                            line,
                                                        )
                                                    }
                                                    onRemove={() =>
                                                        void handleRemoveOrderLine(
                                                            index,
                                                        )
                                                    }
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Add Product Button */}
                                <div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => void handleAddProduct()}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Product
                                    </Button>
                                </div>

                                {/* Totals */}
                                <div className="flex justify-end">
                                    <div className="w-64 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Untaxed Total :
                                            </span>
                                            <span className="font-medium">
                                                {untaxedTotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Tax :
                                            </span>
                                            <span className="font-medium">
                                                {totalTax.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2">
                                            <span className="font-medium">
                                                Total :
                                            </span>
                                            <span className="font-bold">
                                                {total.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms & Conditions */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Terms & Conditions
                                    </label>
                                    <textarea
                                        value={termsAndConditions}
                                        onChange={(e) =>
                                            setTermsAndConditions(
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter terms and conditions..."
                                        className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "other-details" && (
                            <div className="py-8 text-center text-gray-500">
                                <p>Other details content would go here</p>
                            </div>
                        )}

                        {activeTab === "rental-notes" && (
                            <div className="py-8 text-center text-gray-500">
                                <p>Rental notes content would go here</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Edit Order Line Modal */}
            {editingOrderLine && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Edit Order Line
                        </h3>
                        <div className="space-y-4">
                            <FormField
                                label="Product"
                                value={editingOrderLine.line.product}
                                onChange={(value) =>
                                    setEditingOrderLine((prev) =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  line: {
                                                      ...prev.line,
                                                      product: value,
                                                  },
                                              }
                                            : null,
                                    )
                                }
                            />
                            <FormField
                                label="Quantity"
                                value={editingOrderLine.line.quantity.toString()}
                                onChange={(value) => {
                                    const quantity = parseInt(value) || 0;
                                    setEditingOrderLine((prev) =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  line: {
                                                      ...prev.line,
                                                      quantity,
                                                      subTotal:
                                                          quantity *
                                                              prev.line
                                                                  .unitPrice +
                                                          prev.line.tax,
                                                  },
                                              }
                                            : null,
                                    );
                                }}
                            />
                            <FormField
                                label="Unit Price"
                                value={editingOrderLine.line.unitPrice.toString()}
                                onChange={(value) => {
                                    const unitPrice = parseFloat(value) || 0;
                                    setEditingOrderLine((prev) =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  line: {
                                                      ...prev.line,
                                                      unitPrice,
                                                      subTotal:
                                                          prev.line.quantity *
                                                              unitPrice +
                                                          prev.line.tax,
                                                  },
                                              }
                                            : null,
                                    );
                                }}
                            />
                            <FormField
                                label="Tax"
                                value={editingOrderLine.line.tax.toString()}
                                onChange={(value) => {
                                    const tax = parseFloat(value) || 0;
                                    setEditingOrderLine((prev) =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  line: {
                                                      ...prev.line,
                                                      tax,
                                                      subTotal:
                                                          prev.line.quantity *
                                                              prev.line
                                                                  .unitPrice +
                                                          tax,
                                                  },
                                              }
                                            : null,
                                    );
                                }}
                            />
                            <div className="text-sm text-gray-600">
                                Sub Total:{" "}
                                {editingOrderLine.line.subTotal.toLocaleString()}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingOrderLine(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => {
                                    void handleUpdateOrderLine(
                                        editingOrderLine.index,
                                        editingOrderLine.line,
                                    );
                                    setEditingOrderLine(null);
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
