import { NextRequest, NextResponse } from "next/server";

// Dummy rental data for demonstration
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

// GET /api/v1/rentals - Get list of rentals with pagination
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        // Simulate some processing delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedRentals = DUMMY_RENTALS.slice(startIndex, endIndex);

        return NextResponse.json({
            rentals: paginatedRentals,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(DUMMY_RENTALS.length / limit),
                totalItems: DUMMY_RENTALS.length,
            },
        });
    } catch (error) {
        console.error("Error fetching rentals:", error);
        return NextResponse.json(
            { error: "Failed to fetch rentals" },
            { status: 500 },
        );
    }
}

// POST /api/v1/rentals - Create new rental
export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as {
            customer?: string;
            invoiceAddress?: string;
            deliveryAddress?: string;
            rentalTemplate?: string;
            expiration?: string;
            rentalOrderDate?: string;
            priceList?: string;
            rentalPeriod?: string;
            rentalDuration?: string;
        };

        // Simulate some processing delay
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Generate new rental ID
        const newId = `R${String(DUMMY_RENTALS.length + 1).padStart(4, "0")}`;

        const newRental = {
            id: newId,
            customer: body.customer || "New Customer",
            invoiceAddress: body.invoiceAddress || "",
            deliveryAddress: body.deliveryAddress || "",
            rentalTemplate: body.rentalTemplate || "Standard Rental Template",
            expiration:
                body.expiration ||
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
            rentalOrderDate:
                body.rentalOrderDate || new Date().toISOString().split("T")[0],
            priceList: body.priceList || "Standard Price List",
            rentalPeriod: body.rentalPeriod || "Monthly",
            rentalDuration: body.rentalDuration || "1 month",
            status: "draft" as const,
        };

        return NextResponse.json(newRental, { status: 201 });
    } catch (error) {
        console.error("Error creating rental:", error);
        return NextResponse.json(
            { error: "Failed to create rental" },
            { status: 500 },
        );
    }
}
