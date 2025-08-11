import { NextRequest, NextResponse } from "next/server";

// Dummy order lines data (shared reference)
const DUMMY_ORDER_LINES = [
    {
        id: "ol-1",
        rentalId: "R0001",
        product: "Office Chair Premium",
        quantity: 5,
        unitPrice: 200,
        tax: 0,
        subTotal: 1000,
    },
    {
        id: "ol-2",
        rentalId: "R0001",
        product: "Standing Desk Adjustable",
        quantity: 3,
        unitPrice: 450,
        tax: 135,
        subTotal: 1485,
    },
    {
        id: "ol-3",
        rentalId: "R0001",
        product: "Monitor Arm Dual",
        quantity: 8,
        unitPrice: 120,
        tax: 96,
        subTotal: 1056,
    },
    {
        id: "ol-4",
        rentalId: "R0002",
        product: "Laptop Pro",
        quantity: 10,
        unitPrice: 800,
        tax: 240,
        subTotal: 8240,
    },
    {
        id: "ol-5",
        rentalId: "R0002",
        product: "Wireless Mouse",
        quantity: 10,
        unitPrice: 50,
        tax: 15,
        subTotal: 515,
    },
];

// GET /api/v1/rentals/[id]/order-lines/[lineId] - Get single order line
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string; lineId: string } },
) {
    try {
        const { id, lineId } = params;

        // Simulate some processing delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Find the order line
        const orderLine = DUMMY_ORDER_LINES.find(
            (ol) => ol.id === lineId && ol.rentalId === id,
        );
        if (!orderLine) {
            return NextResponse.json(
                { error: "Order line not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(orderLine);
    } catch (error) {
        console.error("Error fetching order line:", error);
        return NextResponse.json(
            { error: "Failed to fetch order line" },
            { status: 500 },
        );
    }
}

// PUT /api/v1/rentals/[id]/order-lines/[lineId] - Update order line
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string; lineId: string } },
) {
    try {
        const { id, lineId } = params;
        const updates = (await request.json()) as {
            product?: string;
            quantity?: number;
            unitPrice?: number;
            tax?: number;
            subTotal?: number;
        };

        // Simulate some processing delay
        await new Promise((resolve) => setTimeout(resolve, 120));

        // Find the order line
        const orderLineIndex = DUMMY_ORDER_LINES.findIndex(
            (ol) => ol.id === lineId && ol.rentalId === id,
        );
        if (orderLineIndex === -1) {
            return NextResponse.json(
                { error: "Order line not found" },
                { status: 404 },
            );
        }

        const currentOrderLine = DUMMY_ORDER_LINES[orderLineIndex];

        // Calculate new subtotal if quantity or unitPrice changed
        let newSubTotal = currentOrderLine.subTotal;
        if (
            updates.quantity !== undefined ||
            updates.unitPrice !== undefined ||
            updates.tax !== undefined
        ) {
            const quantity =
                updates.quantity !== undefined
                    ? updates.quantity
                    : currentOrderLine.quantity;
            const unitPrice =
                updates.unitPrice !== undefined
                    ? updates.unitPrice
                    : currentOrderLine.unitPrice;
            const tax =
                updates.tax !== undefined ? updates.tax : currentOrderLine.tax;
            newSubTotal = quantity * unitPrice + tax;
        }

        // Update the order line
        const updatedOrderLine = {
            ...currentOrderLine,
            ...updates,
            subTotal:
                updates.subTotal !== undefined ? updates.subTotal : newSubTotal,
        };

        // Update in dummy data (in real app, this would be database)
        DUMMY_ORDER_LINES[orderLineIndex] = updatedOrderLine;

        return NextResponse.json(updatedOrderLine);
    } catch (error) {
        console.error("Error updating order line:", error);
        return NextResponse.json(
            { error: "Failed to update order line" },
            { status: 500 },
        );
    }
}

// DELETE /api/v1/rentals/[id]/order-lines/[lineId] - Delete order line
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; lineId: string } },
) {
    try {
        const { id, lineId } = params;

        // Simulate some processing delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Find the order line
        const orderLineIndex = DUMMY_ORDER_LINES.findIndex(
            (ol) => ol.id === lineId && ol.rentalId === id,
        );
        if (orderLineIndex === -1) {
            return NextResponse.json(
                { error: "Order line not found" },
                { status: 404 },
            );
        }

        // Remove from dummy data (in real app, this would be database)
        DUMMY_ORDER_LINES.splice(orderLineIndex, 1);

        return NextResponse.json({
            message: "Order line deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting order line:", error);
        return NextResponse.json(
            { error: "Failed to delete order line" },
            { status: 500 },
        );
    }
}
