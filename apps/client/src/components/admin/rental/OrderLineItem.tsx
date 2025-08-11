import React from "react";
import { Button } from "@client/components/ui/button";
import { Edit, X } from "lucide-react";
import type { RentalOrderLine } from "@client/app/admin/rental/api";

export const OrderLineItem: React.FC<{
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
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onRemove}
                    className="text-red-600 hover:text-red-800"
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>
        </td>
    </tr>
);
