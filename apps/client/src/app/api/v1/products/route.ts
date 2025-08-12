import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/v1/products - Get all products
export async function GET() {
    try {
        const response = await fetch(`${BACKEND_URL}/products`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Backend responded with status: ${response.status}`,
            );
        }

        const data: unknown = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { message: "Failed to fetch products" },
            { status: 500 },
        );
    }
}

// POST /api/v1/products - Create a new product
export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();

        // Type guard for body validation
        if (typeof body !== "object" || body === null) {
            return NextResponse.json(
                { message: "Invalid request body" },
                { status: 400 },
            );
        }

        const typedBody = body as Record<string, unknown>;

        // Validate required fields
        if (
            !typedBody.name ||
            !typedBody.price ||
            typedBody.quantity === undefined
        ) {
            return NextResponse.json(
                { message: "Name, price, and quantity are required" },
                { status: 400 },
            );
        }

        const response = await fetch(`${BACKEND_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(typedBody),
        });

        if (!response.ok) {
            const errorData: unknown = await response.json().catch(() => ({}));
            return NextResponse.json(
                { message: "Failed to create product", error: errorData },
                { status: response.status },
            );
        }

        const data: unknown = await response.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { message: "Failed to create product" },
            { status: 500 },
        );
    }
}
