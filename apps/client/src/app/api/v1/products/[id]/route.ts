import { NextResponse } from "next/server";

const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

// GET /api/v1/products/[id] - Get a product by id
export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;

        const response = await fetch(`${BACKEND_URL}/products/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 404) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 },
            );
        }

        if (!response.ok) {
            throw new Error(
                `Backend responded with status: ${response.status}`,
            );
        }

        const data: unknown = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { message: "Failed to fetch product" },
            { status: 500 },
        );
    }
}

// PUT /api/v1/products/[id] - Update a product
export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;
        const body: unknown = await request.json();

        const response = await fetch(`${BACKEND_URL}/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (response.status === 404) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 },
            );
        }

        if (!response.ok) {
            const errorData: unknown = await response.json().catch(() => ({}));
            return NextResponse.json(
                { message: "Failed to update product", error: errorData },
                { status: response.status },
            );
        }

        const data: unknown = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { message: "Failed to update product" },
            { status: 500 },
        );
    }
}

// DELETE /api/v1/products/[id] - Delete a product
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;

        const response = await fetch(`${BACKEND_URL}/products/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 404) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 },
            );
        }

        if (!response.ok) {
            throw new Error(
                `Backend responded with status: ${response.status}`,
            );
        }

        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { message: "Failed to delete product" },
            { status: 500 },
        );
    }
}
