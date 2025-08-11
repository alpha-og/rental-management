import { NextRequest, NextResponse } from "next/server";

// Dummy rental data (same as in the main route)
const DUMMY_RENTALS = [
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
    },
] as const;

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
] as const;

// GET /api/v1/rentals/[id] - Get single rental with order lines
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;

        // Simulate some processing delay
        await new Promise((resolve) => setTimeout(resolve, 150));

        // Find the rental
        const rental = DUMMY_RENTALS.find((r) => r.id === id);
        if (!rental) {
            return NextResponse.json(
                { error: "Rental not found" },
                { status: 404 },
            );
        }

        // Get order lines for this rental
        const orderLines = DUMMY_ORDER_LINES.filter((ol) => ol.rentalId === id);

        // Terms and conditions
        const termsAndConditions =
            "1. All rental equipment must be returned in original condition.\n2. Monthly payments are due on the 1st of each month.\n3. Late fees apply after 15 days past due date.\n4. Equipment insurance is included in the rental fee.\n5. Customer is responsible for normal wear and tear.";

        return NextResponse.json({
            rental,
            orderLines,
            termsAndConditions,
            pagination: {
                currentPage: 1,
                totalPages: 80,
                totalItems: 158,
            },
        });
    } catch (error) {
        console.error("Error fetching rental:", error);
        return NextResponse.json(
            { error: "Failed to fetch rental" },
            { status: 500 },
        );
    }
}

// PUT /api/v1/rentals/[id] - Update rental data
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;
        const updates = (await request.json()) as Partial<
            (typeof DUMMY_RENTALS)[0]
        >;

        // Simulate some processing delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Find the rental
        const rental = DUMMY_RENTALS.find((r) => r.id === id);
        if (!rental) {
            return NextResponse.json(
                { error: "Rental not found" },
                { status: 404 },
            );
        }

        // In a real implementation, you would update the database
        // For now, return the updated rental (simulated)
        const updatedRental = { ...rental, ...updates };

        return NextResponse.json(updatedRental);
    } catch (error) {
        console.error("Error updating rental:", error);
        return NextResponse.json(
            { error: "Failed to update rental" },
            { status: 500 },
        );
    }
}

// DELETE /api/v1/rentals/[id] - Delete rental
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;

        // Simulate some processing delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Find the rental
        const rental = DUMMY_RENTALS.find((r) => r.id === id);
        if (!rental) {
            return NextResponse.json(
                { error: "Rental not found" },
                { status: 404 },
            );
        }

        // In a real implementation, you would delete from the database
        // For now, just return success
        return NextResponse.json({ message: "Rental deleted successfully" });
    } catch (error) {
        console.error("Error deleting rental:", error);
        return NextResponse.json(
            { error: "Failed to delete rental" },
            { status: 500 },
        );
    }
}
