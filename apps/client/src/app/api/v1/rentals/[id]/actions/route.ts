import { NextRequest, NextResponse } from "next/server";

// Dummy rental data (same as in other endpoints)
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

type RentalStatus = "draft" | "quotation_sent" | "confirmed" | "cancelled";
type RentalAction = "send" | "print" | "confirm" | "cancel";

// POST /api/v1/rentals/[id]/actions - Perform action on rental
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;
        const { action } = (await request.json()) as { action: string };

        // Simulate some processing delay
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Find the rental
        const rental = DUMMY_RENTALS.find((r) => r.id === id);
        if (!rental) {
            return NextResponse.json(
                { error: "Rental not found" },
                { status: 404 },
            );
        }

        // Validate action
        const validActions: RentalAction[] = [
            "send",
            "print",
            "confirm",
            "cancel",
        ];
        if (!validActions.includes(action as RentalAction)) {
            return NextResponse.json(
                { error: "Invalid action" },
                { status: 400 },
            );
        }

        // Determine new status based on action
        let newStatus: RentalStatus = rental.status;
        let actionResult = "";

        switch (action as RentalAction) {
            case "send":
                if (rental.status === "draft") {
                    newStatus = "quotation_sent";
                    actionResult = "Quotation sent successfully";
                } else {
                    actionResult = "Quotation resent successfully";
                }
                break;
            case "print":
                actionResult = "Rental document prepared for printing";
                // Print action doesn't change status
                break;
            case "confirm":
                if (
                    rental.status === "quotation_sent" ||
                    rental.status === "draft"
                ) {
                    newStatus = "confirmed";
                    actionResult = "Rental confirmed successfully";
                } else {
                    return NextResponse.json(
                        { error: "Cannot confirm rental in current status" },
                        { status: 400 },
                    );
                }
                break;
            case "cancel":
                if (rental.status !== "cancelled") {
                    newStatus = "cancelled";
                    actionResult = "Rental cancelled successfully";
                } else {
                    return NextResponse.json(
                        { error: "Rental is already cancelled" },
                        { status: 400 },
                    );
                }
                break;
        }

        // In a real implementation, you would update the database
        // For now, return the updated rental (simulated)
        const updatedRental = { ...rental, status: newStatus };

        return NextResponse.json({
            rental: updatedRental,
            message: actionResult,
            action: action,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error performing rental action:", error);
        return NextResponse.json(
            { error: "Failed to perform action" },
            { status: 500 },
        );
    }
}
