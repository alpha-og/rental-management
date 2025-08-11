import { NextRequest, NextResponse } from "next/server";

// Dummy order lines data
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

// GET /api/v1/rentals/[id]/order-lines - Get order lines for a rental
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;

        // Simulate some processing delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Get order lines for this rental
        const orderLines = DUMMY_ORDER_LINES.filter((ol) => ol.rentalId === id);

        return NextResponse.json(orderLines);
    } catch (error) {
        console.error("Error fetching order lines:", error);
        return NextResponse.json(
            { error: "Failed to fetch order lines" },
            { status: 500 },
        );
    }
}

// POST /api/v1/rentals/[id]/order-lines - Add new order line
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;
        const orderLineData = (await request.json()) as {
            product?: string;
            quantity?: number;
            unitPrice?: number;
            tax?: number;
        };

        // Simulate some processing delay
        await new Promise((resolve) => setTimeout(resolve, 150));

        // Generate new order line ID
        const newId = `ol-${Date.now()}`;

        // Calculate subtotal
        const subTotal =
            (orderLineData.quantity || 1) * (orderLineData.unitPrice || 0) +
            (orderLineData.tax || 0);

        const newOrderLine = {
            id: newId,
            rentalId: id,
            product: orderLineData.product || "New Product",
            quantity: orderLineData.quantity || 1,
            unitPrice: orderLineData.unitPrice || 0,
            tax: orderLineData.tax || 0,
            subTotal,
        };

        // Add to dummy data (in real app, this would be database)
        DUMMY_ORDER_LINES.push(newOrderLine);

        return NextResponse.json(newOrderLine, { status: 201 });
    } catch (error) {
        console.error("Error creating order line:", error);
        return NextResponse.json(
            { error: "Failed to create order line" },
            { status: 500 },
        );
    }
}
