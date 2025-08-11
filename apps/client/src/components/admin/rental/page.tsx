"use client";

import React, { useState, useEffect } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Send,
    Printer,
    Check,
    Info,
    FileText,
    Package,
    Trash2,
} from "lucide-react";
import { Button } from "@client/components/ui/button";
import { cn } from "@client/lib/utils";
import {
    getRentalData,
    updateRentalData,
    addOrderLine,
    updateOrderLine,
    deleteOrderLine,
    sendInvoiceEmail,
    deleteRental,
    type RentalFormData,
    type RentalOrderLine,
} from "@client/app/admin/rental/api";
import {
    StatusBadge,
    DeliveryStatusBadge,
    InvoiceStatusBadge,
    FormField,
    OrderLineItem,
} from "./index";

// Default/initial data to prevent controlled input issues
const defaultRentalData: RentalFormData = {
    id: "",
    customer: "",
    invoiceAddress: "",
    deliveryAddress: "",
    rentalTemplate: "",
    expiration: "",
    rentalOrderDate: "",
    priceList: "",
    rentalPeriod: "",
    rentalDuration: "",
    status: "draft",
    deliveryStatus: "pending",
    invoiceStatus: "pending",
};

export default function RentalPage() {
    const [rentalData, setRentalData] =
        useState<RentalFormData>(defaultRentalData);
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

    // New state for enhanced features
    const [processingPrint, setProcessingPrint] = useState(false);
    const [processingSend, setProcessingSend] = useState(false);
    const [processingDelete, setProcessingDelete] = useState(false);

    // Removed page-level MobileMenuButton; header button is provided by AdminLayout

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
                setError("Failed to load rental data");
            } finally {
                setLoading(false);
            }
        };

        void fetchRentalData();
    }, []);

    // Update rental data
    const handleUpdateRentalData = async (updates: Partial<RentalFormData>) => {
        try {
            const updatedRental = await updateRentalData(
                rentalData.id,
                updates,
            );
            setRentalData(updatedRental);
        } catch (err) {
            console.error("Failed to update rental data:", err);
            setError("Failed to update rental data");
        }
    };

    // Update rental status
    const handleUpdateStatus = async (status: RentalFormData["status"]) => {
        try {
            setRentalData((prev) =>
                prev ? { ...prev, status } : defaultRentalData,
            );
            // Status update would typically call an API here
            await updateRentalData(rentalData.id, { status });
        } catch (err) {
            console.error("Failed to update status:", err);
            setError("Failed to update status");
        }
    };

    // Print invoice as PDF - proper implementation
    const handlePrintInvoice = () => {
        console.log("Generate PDF button clicked");

        if (!rentalData) {
            console.error("No rental data available for PDF generation");
            alert("No rental data available for PDF generation");
            return;
        }

        if (rentalData.status !== "confirmed") {
            alert("Please confirm the quotation before printing the invoice.");
            return;
        }

        try {
            setProcessingPrint(true);
            console.log("Generating PDF for rental:", rentalData.id);

            const printWindow = window.open("", "_blank");
            if (!printWindow) {
                console.error("Failed to open print window - popup blocked?");
                alert(
                    "Failed to open print window. Please allow popups and try again.",
                );
                return;
            }

            // Calculate totals
            const calculateTotals = () => {
                const untaxedTotal = orderLines.reduce(
                    (sum, line) => sum + line.subTotal,
                    0,
                );
                const totalTax = orderLines.reduce(
                    (sum, line) => sum + line.tax,
                    0,
                );
                const total = untaxedTotal + totalTax;
                return { untaxedTotal, totalTax, total };
            };

            const { untaxedTotal, totalTax, total } = calculateTotals();

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
                            ${
                                rentalData.deliveryStatus
                                    ? `
                            <div class="info-item">
                                <span class="info-label">Delivery Status:</span>
                                <span class="info-value">${rentalData.deliveryStatus.replace("_", " ")}</span>
                            </div>
                            `
                                    : ""
                            }
                            ${
                                rentalData.invoiceStatus
                                    ? `
                            <div class="info-item">
                                <span class="info-label">Invoice Status:</span>
                                <span class="info-value">${rentalData.invoiceStatus}</span>
                            </div>
                            `
                                    : ""
                            }
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

            console.log("✅ PDF window opened successfully");
        } catch (error) {
            console.error("❌ Failed to generate PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setProcessingPrint(false);
        }
    };

    // Send invoice via email
    const handleSendInvoiceEmail = async () => {
        if (!rentalData || rentalData.status !== "confirmed") {
            alert("Please confirm the quotation before sending the invoice.");
            return;
        }

        try {
            setProcessingSend(true);
            console.log("📧 Sending invoice via email...");

            const result = await sendInvoiceEmail(rentalData.id);

            if (result.success) {
                alert(`✅ ${result.message}`);
                console.log("✅ Invoice sent successfully");
            } else {
                alert(`❌ ${result.message}`);
            }
        } catch (error) {
            console.error("❌ Failed to send invoice:", error);
            alert("Failed to send invoice. Please try again.");
        } finally {
            setProcessingSend(false);
        }
    };

    // Delete quotation
    const handleDeleteQuotation = async () => {
        if (!rentalData) return;

        if (rentalData.status === "confirmed") {
            alert(
                "Cannot delete a confirmed quotation. Please cancel it first.",
            );
            return;
        }

        const confirmDelete = window.confirm(
            `Are you sure you want to delete this quotation (${rentalData.id})? This action cannot be undone.`,
        );

        if (!confirmDelete) return;

        try {
            setProcessingDelete(true);
            console.log("🗑️ Deleting quotation...");

            const result = await deleteRental(rentalData.id);

            if (result.success) {
                alert(`✅ ${result.message}`);
                console.log("✅ Quotation deleted successfully");
                // Redirect to rental list or reset form
                window.location.href = "/admin/rental";
            } else {
                alert(`❌ ${result.message}`);
            }
        } catch (error) {
            console.error("❌ Failed to delete quotation:", error);
            alert("Failed to delete quotation. Please try again.");
        } finally {
            setProcessingDelete(false);
        }
    };

    // Order line management
    const handleAddOrderLine = async () => {
        const newOrderLine: Omit<RentalOrderLine, "id"> = {
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
            setError("Failed to add order line");
        }
    };

    const handleEditOrderLine = (index: number, line: RentalOrderLine) => {
        setEditingOrderLine({ index, line });
    };

    const handleUpdateOrderLine = async () => {
        if (!editingOrderLine) return;

        try {
            const updatedLine = await updateOrderLine(
                rentalData.id,
                editingOrderLine.line.id,
                editingOrderLine.line,
            );
            setOrderLines((prev) =>
                prev.map((line, index) =>
                    index === editingOrderLine.index ? updatedLine : line,
                ),
            );
            setEditingOrderLine(null);
        } catch (err) {
            console.error("Failed to update order line:", err);
            setError("Failed to update order line");
        }
    };

    const handleDeleteOrderLine = async (index: number, lineId: string) => {
        try {
            await deleteOrderLine(rentalData.id, lineId);
            setOrderLines((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            console.error("Failed to delete order line:", err);
            setError("Failed to delete order line");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">Loading rental data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Rental Management
                    </h1>
                    <p className="text-gray-600">
                        Manage rental orders and customer information
                    </p>
                </div>
                {/* Intentionally left empty: global header (AdminLayout) renders the mobile menu button */}
            </div>

            {/* Rental Info Section */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Rental #{rentalData.id}
                        </h2>
                        <StatusBadge status={rentalData.status} />
                        <DeliveryStatusBadge
                            status={rentalData.deliveryStatus}
                        />
                        <InvoiceStatusBadge status={rentalData.invoiceStatus} />
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Action Buttons */}
                        <Button
                            onClick={() => {
                                void handleUpdateStatus("confirmed");
                            }}
                            disabled={rentalData.status === "confirmed"}
                            className="flex items-center gap-2"
                        >
                            <Check className="h-4 w-4" />
                            Confirm
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                void handleSendInvoiceEmail();
                            }}
                            disabled={
                                processingSend ||
                                rentalData.status !== "confirmed"
                            }
                            className="flex items-center gap-2"
                        >
                            <Send className="h-4 w-4" />
                            {processingSend ? "Sending..." : "Send Email"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handlePrintInvoice}
                            disabled={
                                processingPrint ||
                                rentalData.status !== "confirmed"
                            }
                            className="flex items-center gap-2"
                        >
                            <Printer className="h-4 w-4" />
                            {processingPrint ? "Printing..." : "Print Invoice"}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                void handleDeleteQuotation();
                            }}
                            disabled={
                                processingDelete ||
                                rentalData.status === "confirmed"
                            }
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            {processingDelete ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>

                {/* Rental Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                        label="Customer"
                        value={rentalData.customer}
                        onChange={(value) => {
                            void handleUpdateRentalData({ customer: value });
                        }}
                    />
                    <FormField
                        label="Invoice Address"
                        value={rentalData.invoiceAddress}
                        onChange={(value) => {
                            void handleUpdateRentalData({
                                invoiceAddress: value,
                            });
                        }}
                    />
                    <FormField
                        label="Delivery Address"
                        value={rentalData.deliveryAddress}
                        onChange={(value) => {
                            void handleUpdateRentalData({
                                deliveryAddress: value,
                            });
                        }}
                    />
                    <FormField
                        label="Rental Template"
                        value={rentalData.rentalTemplate}
                        onChange={(value) => {
                            void handleUpdateRentalData({
                                rentalTemplate: value,
                            });
                        }}
                    />
                    <FormField
                        label="Expiration"
                        value={rentalData.expiration}
                        onChange={(value) => {
                            void handleUpdateRentalData({ expiration: value });
                        }}
                    />
                    <FormField
                        label="Rental Order Date"
                        value={rentalData.rentalOrderDate}
                        onChange={(value) => {
                            void handleUpdateRentalData({
                                rentalOrderDate: value,
                            });
                        }}
                    />
                    <FormField
                        label="Price List"
                        value={rentalData.priceList}
                        onChange={(value) => {
                            void handleUpdateRentalData({ priceList: value });
                        }}
                    />
                    <FormField
                        label="Rental Period"
                        value={rentalData.rentalPeriod}
                        onChange={(value) => {
                            void handleUpdateRentalData({
                                rentalPeriod: value,
                            });
                        }}
                    />
                    <FormField
                        label="Rental Duration"
                        value={rentalData.rentalDuration}
                        onChange={(value) => {
                            void handleUpdateRentalData({
                                rentalDuration: value,
                            });
                        }}
                    />
                </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-lg border shadow-sm">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab("order-lines")}
                            className={cn(
                                "py-2 px-1 border-b-2 font-medium text-sm",
                                activeTab === "order-lines"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                            )}
                        >
                            <Package className="h-4 w-4 inline mr-2" />
                            Order Lines
                        </button>
                        <button
                            onClick={() => setActiveTab("other-details")}
                            className={cn(
                                "py-2 px-1 border-b-2 font-medium text-sm",
                                activeTab === "other-details"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                            )}
                        >
                            <Info className="h-4 w-4 inline mr-2" />
                            Other Details
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
                            <FileText className="h-4 w-4 inline mr-2" />
                            Rental Notes
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === "order-lines" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Order Lines
                                </h3>
                                <Button
                                    onClick={() => {
                                        void handleAddOrderLine();
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Order Line
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Unit Price
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tax
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sub Total
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orderLines.map((orderLine, index) => (
                                            <OrderLineItem
                                                key={orderLine.id}
                                                orderLine={orderLine}
                                                onEdit={() =>
                                                    handleEditOrderLine(
                                                        index,
                                                        orderLine,
                                                    )
                                                }
                                                onRemove={() => {
                                                    void handleDeleteOrderLine(
                                                        index,
                                                        orderLine.id,
                                                    );
                                                }}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Edit Order Line Modal */}
                            {editingOrderLine && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                                        <h3 className="text-lg font-semibold mb-4">
                                            Edit Order Line
                                        </h3>
                                        <div className="space-y-4">
                                            <FormField
                                                label="Product"
                                                value={
                                                    editingOrderLine.line
                                                        .product
                                                }
                                                onChange={(value) =>
                                                    setEditingOrderLine(
                                                        (prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      line: {
                                                                          ...prev.line,
                                                                          product:
                                                                              value,
                                                                      },
                                                                  }
                                                                : null,
                                                    )
                                                }
                                            />
                                            <FormField
                                                label="Quantity"
                                                value={editingOrderLine.line.quantity.toString()}
                                                onChange={(value) =>
                                                    setEditingOrderLine(
                                                        (prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      line: {
                                                                          ...prev.line,
                                                                          quantity:
                                                                              parseInt(
                                                                                  value,
                                                                              ) ||
                                                                              0,
                                                                      },
                                                                  }
                                                                : null,
                                                    )
                                                }
                                            />
                                            <FormField
                                                label="Unit Price"
                                                value={editingOrderLine.line.unitPrice.toString()}
                                                onChange={(value) =>
                                                    setEditingOrderLine(
                                                        (prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      line: {
                                                                          ...prev.line,
                                                                          unitPrice:
                                                                              parseFloat(
                                                                                  value,
                                                                              ) ||
                                                                              0,
                                                                      },
                                                                  }
                                                                : null,
                                                    )
                                                }
                                            />
                                            <FormField
                                                label="Tax"
                                                value={editingOrderLine.line.tax.toString()}
                                                onChange={(value) =>
                                                    setEditingOrderLine(
                                                        (prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      line: {
                                                                          ...prev.line,
                                                                          tax:
                                                                              parseFloat(
                                                                                  value,
                                                                              ) ||
                                                                              0,
                                                                      },
                                                                  }
                                                                : null,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2 mt-6">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setEditingOrderLine(null)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    void handleUpdateOrderLine();
                                                }}
                                            >
                                                Update
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "other-details" && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Other Details
                            </h3>
                            <p className="text-gray-600">
                                Additional rental information and settings will
                                be displayed here.
                            </p>
                        </div>
                    )}

                    {activeTab === "rental-notes" && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Terms and Conditions
                            </h3>
                            <textarea
                                value={termsAndConditions}
                                onChange={(e) =>
                                    setTermsAndConditions(e.target.value)
                                }
                                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none"
                                placeholder="Enter terms and conditions..."
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(totalPages, prev + 1),
                            )
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
