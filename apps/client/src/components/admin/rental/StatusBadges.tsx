import React from "react";
import { cn } from "@client/lib/utils";
import type { RentalFormData } from "@client/app/admin/rental/api";

export const StatusBadge: React.FC<{
    status: RentalFormData["status"];
}> = ({ status }) => {
    const getStatusConfig = (status: RentalFormData["status"]) => {
        switch (status) {
            case "draft":
                return {
                    label: "Draft",
                    className: "bg-gray-100 text-gray-800",
                };
            case "quotation_sent":
                return {
                    label: "Quotation Sent",
                    className: "bg-blue-100 text-blue-800",
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
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                config.className,
            )}
        >
            {config.label}
        </span>
    );
};

export const DeliveryStatusBadge: React.FC<{
    status?: RentalFormData["deliveryStatus"];
}> = ({ status }) => {
    if (!status) return null;

    const getStatusConfig = (
        status: NonNullable<RentalFormData["deliveryStatus"]>,
    ) => {
        switch (status) {
            case "pending":
                return {
                    label: "Pending",
                    className: "bg-yellow-100 text-yellow-800",
                };
            case "pickup_ready":
                return {
                    label: "Ready",
                    className: "bg-blue-100 text-blue-800",
                };
            case "delivered":
                return {
                    label: "Delivered",
                    className: "bg-green-100 text-green-800",
                };
            case "returned":
                return {
                    label: "Returned",
                    className: "bg-purple-100 text-purple-800",
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
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                config.className,
            )}
        >
            {config.label}
        </span>
    );
};

export const InvoiceStatusBadge: React.FC<{
    status?: RentalFormData["invoiceStatus"];
}> = ({ status }) => {
    if (!status) return null;

    const getStatusConfig = (
        status: NonNullable<RentalFormData["invoiceStatus"]>,
    ) => {
        switch (status) {
            case "pending":
                return {
                    label: "Pending",
                    className: "bg-yellow-100 text-yellow-800",
                };
            case "created":
                return {
                    label: "Created",
                    className: "bg-blue-100 text-blue-800",
                };
            case "sent":
                return {
                    label: "Sent",
                    className: "bg-blue-100 text-blue-800",
                };
            case "paid":
                return {
                    label: "Paid",
                    className: "bg-green-100 text-green-800",
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
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                config.className,
            )}
        >
            {config.label}
        </span>
    );
};
