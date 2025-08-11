"use client";
import React, { JSX, useState } from "react";
import { Filter as FilterIcon, X } from "lucide-react";
import Filter from "@client/components/user/filter";
import { ProductGrid, Product } from "@client/components/user/product";
import { Navbar } from "@client/components/ui/navbar"; // <-- added

interface FilterState {
    priceRange: [number, number];
    categories: string[];
    rating: number;
}

const sampleProducts: Product[] = [
    { id: 1, name: "Sample Product 1", price: 99.99, rating: 4.5 },
    { id: 2, name: "Sample Product 2", price: 149.99, rating: 4.2 },
    { id: 3, name: "Sample Product 3", price: 79.99, rating: 4.8 },
    { id: 4, name: "Sample Product 4", price: 199.99, rating: 4.1 },
    { id: 5, name: "Sample Product 5", price: 129.99, rating: 4.6 },
    { id: 6, name: "Sample Product 6", price: 89.99, rating: 4.3 },
];

export default function UserPage(): JSX.Element {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 1000],
        categories: [],
        rating: 0,
    });

    const clearFilters = () =>
        setFilters({ priceRange: [0, 1000], categories: [], rating: 0 });
    const hasActiveFilters =
        filters.categories.length > 0 || filters.rating > 0;

    return (
        <div className="min-h-screen bg-gray-100 relative">
            <Navbar hideAuthButtons /> {/* Navbar added here */}
            {/* Filter Toggle Button */}
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg transition-colors duration-200"
                aria-label="Toggle filter drawer"
            >
                <FilterIcon
                    className={`w-5 h-5 transform transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}
                />
            </button>
            {/* Main Content */}
            <div
                className={`transition-all duration-300 ${isFilterOpen ? "lg:mr-80" : "mr-0"}`}
            >
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">User Profile</h1>

                    {hasActiveFilters && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-600 mb-2">
                                Active Filters:
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {filters.categories.map((category) => (
                                    <span
                                        key={category}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                        {category}
                                        <button
                                            onClick={() =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    categories:
                                                        prev.categories.filter(
                                                            (c) =>
                                                                c !== category,
                                                        ),
                                                }))
                                            }
                                            className="ml-1 hover:text-blue-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                {filters.rating > 0 && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        {filters.rating}+ stars
                                        <button
                                            onClick={() =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    rating: 0,
                                                }))
                                            }
                                            className="ml-1 hover:text-yellow-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    <ProductGrid products={sampleProducts} />
                </div>
            </div>
            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsFilterOpen(false)}
                />
            )}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-40 ${
                    isFilterOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                        onClick={() => setIsFilterOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                        aria-label="Close filter drawer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="overflow-y-auto h-full pb-16">
                    <Filter
                        filters={filters}
                        onFiltersChange={setFilters}
                        onClearFilters={clearFilters}
                    />
                </div>
            </div>
        </div>
    );
}
