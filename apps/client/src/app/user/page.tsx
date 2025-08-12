"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Filter as FilterIcon, X } from "lucide-react";
import Filter from "@client/components/user/filter";
import { ProductGrid, Product } from "@client/components/user/product";
import { Navbar } from "@client/components/ui/navbar";
import { Footer } from "@client/components/ui/footer";
import { Pagination } from "@client/components/ui/pagination";
import productsData from "./dummy.json";

interface FilterState {
    priceRange: [number, number];
    rating: number;
}

const ITEMS_PER_PAGE = 9;
const DEFAULT_FILTERS: FilterState = {
    priceRange: [0, 1000],
    rating: 0,
    categories: [],
};

export default function UserPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

    const products = Array.isArray(productsData.products)
        ? (productsData.products as Product[])
        : [];

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesPrice =
                product.price >= filters.priceRange[0] &&
                product.price <= filters.priceRange[1];
            const matchesRating = product.rating >= filters.rating;
            return matchesPrice && matchesRating;
        });
    }, [products, filters]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE,
    );

    const hasActiveFilters =
        filters.rating > 0 ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < 1000;

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const clearFilters = () => setFilters(DEFAULT_FILTERS);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const FilterTag = ({
        children,
        onRemove,
        className = "",
    }: {
        children: React.ReactNode;
        onRemove: () => void;
        className?: string;
    }) => (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}
        >
            {children}
            <button onClick={onRemove} className="ml-1 hover:opacity-70">
                <X className="w-3 h-3" />
            </button>
        </span>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 relative">
            <Navbar hideAuthButtons />

            <main className="flex-grow">
                {/* Filter Toggle Button */}
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg transition-colors"
                    aria-label="Toggle filter drawer"
                >
                    <FilterIcon
                        className={`w-5 h-5 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {/* Main Content */}
                <div
                    className={`transition-all duration-300 ${isFilterOpen ? "lg:mr-80" : ""} p-6`}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Products</h1>
                        <div className="text-sm text-gray-600">
                            Showing {startIndex + 1}-
                            {Math.min(
                                startIndex + ITEMS_PER_PAGE,
                                filteredProducts.length,
                            )}{" "}
                            of {filteredProducts.length} products
                        </div>
                    </div>

                    {/* Active Filters */}
                    {hasActiveFilters && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">
                                    Active Filters:
                                </h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {filters.rating > 0 && (
                                    <FilterTag
                                        onRemove={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                rating: 0,
                                            }))
                                        }
                                        className="bg-yellow-100 text-yellow-800"
                                    >
                                        {filters.rating}+ stars
                                    </FilterTag>
                                )}
                                {(filters.priceRange[0] > 0 ||
                                    filters.priceRange[1] < 1000) && (
                                    <FilterTag
                                        onRemove={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                priceRange: [0, 1000],
                                            }))
                                        }
                                        className="bg-green-100 text-green-800"
                                    >
                                        ${filters.priceRange[0]} - $
                                        {filters.priceRange[1]}
                                    </FilterTag>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Products or Empty State */}
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <FilterIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No products found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Try adjusting your filters to see more results
                            </p>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <ProductGrid products={currentProducts} />
                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        showEllipsis={true}
                                        maxVisiblePages={5}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Filter Drawer */}
            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsFilterOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-xl transform transition-transform z-40 ${
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

            <Footer />
        </div>
    );
}
