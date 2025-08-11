"use client";
import React from "react";
import { X } from "lucide-react";

interface FilterState {
    priceRange: [number, number];
    categories: string[];
    rating: number;
}

interface FilterProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    onClearFilters: () => void;
}

const Filter: React.FC<FilterProps> = ({
    filters,
    onFiltersChange,
    onClearFilters,
}) => {
    const categories = [
        "Electronics",
        "Clothing",
        "Home & Garden",
        "Sports",
        "Books",
        "Beauty",
        "Automotive",
        "Toys & Games",
    ];

    const handlePriceChange = (type: "min" | "max", value: number) => {
        const newPriceRange: [number, number] =
            type === "min"
                ? [value, filters.priceRange[1]]
                : [filters.priceRange[0], value];
        onFiltersChange({
            ...filters,
            priceRange: newPriceRange,
        });
    };

    const handleCategoryToggle = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter((c) => c !== category)
            : [...filters.categories, category];
        onFiltersChange({
            ...filters,
            categories: newCategories,
        });
    };

    const handleRatingChange = (rating: number) => {
        onFiltersChange({
            ...filters,
            rating: filters.rating === rating ? 0 : rating,
        });
    };

    const activeFilterCount =
        filters.categories.length + (filters.rating > 0 ? 1 : 0);

    return (
        <div className="p-4 space-y-6">
            {/* Clear Filters */}
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                    {activeFilterCount} filter
                    {activeFilterCount !== 1 ? "s" : ""} applied
                </span>
                <button
                    onClick={onClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                    <X className="w-3 h-3" />
                    <span>Clear all</span>
                </button>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wide">
                    Price Range
                </h3>
                <div className="space-y-3">
                    <div className="flex space-x-3">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">
                                Min
                            </label>
                            <input
                                type="number"
                                value={filters.priceRange[0]}
                                onChange={(e) =>
                                    handlePriceChange(
                                        "min",
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="0"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">
                                Max
                            </label>
                            <input
                                type="number"
                                value={filters.priceRange[1]}
                                onChange={(e) =>
                                    handlePriceChange(
                                        "max",
                                        parseInt(e.target.value) || 1000,
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="1000"
                            />
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wide">
                    Categories
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                        <label
                            key={category}
                            className="flex items-center space-x-3 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(category)}
                                onChange={() => handleCategoryToggle(category)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                {category}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wide">
                    Minimum Rating
                </h3>
                <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleRatingChange(star)}
                            className={`transition-colors duration-200 ${
                                star <= filters.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300 hover:text-yellow-200"
                            }`}
                        >
                            <svg
                                className="w-5 h-5"
                                fill={
                                    star <= filters.rating
                                        ? "currentColor"
                                        : "none"
                                }
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                            </svg>
                        </button>
                    ))}
                    {filters.rating > 0 && (
                        <span className="text-sm text-gray-600 ml-2">
                            {filters.rating} star
                            {filters.rating !== 1 ? "s" : ""} & up
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Filter;
