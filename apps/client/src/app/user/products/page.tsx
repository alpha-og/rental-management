import React from "react";
import { Navbar } from "@client/components/ui/navbar";
import { Footer } from "@client/components/ui/footer";
import { ProductGrid } from "@client/components/user/product";

// Mock products data
const mockProducts = [
    { id: 1, name: "Product A", price: 25.0, rating: 4.5 },
    { id: 2, name: "Product B", price: 10.5, rating: 3.8 },
    { id: 3, name: "Product C", price: 50.0, rating: 4.2 },
    { id: 4, name: "Camera Equipment", price: 150.0, rating: 4.8 },
    { id: 5, name: "Sound System", price: 200.0, rating: 4.6 },
    { id: 6, name: "Projector", price: 300.0, rating: 4.3 },
];

export default function ProductsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar hideAuthButtons={true} />
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">
                        All Products
                    </h1>
                    <ProductGrid products={mockProducts} />
                </div>
            </main>
            <Footer />
        </div>
    );
}
