import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showEllipsis?: boolean;
    maxVisiblePages?: number;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    showEllipsis = true,
    maxVisiblePages = 5,
    className = "",
}) => {
    const getVisiblePages = () => {
        if (!showEllipsis || totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | "ellipsis")[] = [];
        const halfVisible = Math.floor(maxVisiblePages / 2);

        // Always show first page
        pages.push(1);

        let start = Math.max(2, currentPage - halfVisible);
        let end = Math.min(totalPages - 1, currentPage + halfVisible);

        // Adjust start and end to maintain maxVisiblePages count
        if (end - start + 1 < maxVisiblePages - 2) {
            if (start === 2) {
                end = Math.min(totalPages - 1, start + maxVisiblePages - 3);
            } else {
                start = Math.max(2, end - maxVisiblePages + 3);
            }
        }

        // Add ellipsis after first page if needed
        if (start > 2) {
            pages.push("ellipsis");
        }

        // Add middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add ellipsis before last page if needed
        if (end < totalPages - 1) {
            pages.push("ellipsis");
        }

        // Always show last page (if it's not the same as first page)
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav
            className={`flex items-center justify-center space-x-1 ${className}`}
            aria-label="Pagination"
        >
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`
                    flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${
                        currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }
                `}
                aria-label="Go to previous page"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
                {visiblePages.map((page, index) => {
                    if (page === "ellipsis") {
                        return (
                            <div
                                key={`ellipsis-${index}`}
                                className="flex items-center justify-center w-10 h-10 text-gray-500"
                                aria-hidden="true"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </div>
                        );
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`
                                flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200
                                ${
                                    currentPage === page
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                }
                            `}
                            aria-label={`Go to page ${page}`}
                            aria-current={
                                currentPage === page ? "page" : undefined
                            }
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`
                    flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${
                        currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }
                `}
                aria-label="Go to next page"
            >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
            </button>
        </nav>
    );
};

// Simple pagination variant without Previous/Next text
export const SimplePagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    showEllipsis = true,
    maxVisiblePages = 7,
    className = "",
}) => {
    const getVisiblePages = () => {
        if (!showEllipsis || totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | "ellipsis")[] = [];
        const halfVisible = Math.floor((maxVisiblePages - 2) / 2); // -2 for first and last

        // Always show first page
        pages.push(1);

        if (currentPage <= halfVisible + 2) {
            // Show pages from start
            for (
                let i = 2;
                i <= Math.min(maxVisiblePages - 1, totalPages - 1);
                i++
            ) {
                pages.push(i);
            }
            if (maxVisiblePages - 1 < totalPages - 1) {
                pages.push("ellipsis");
            }
        } else if (currentPage >= totalPages - halfVisible - 1) {
            // Show pages from end
            if (totalPages - maxVisiblePages + 2 > 2) {
                pages.push("ellipsis");
            }
            for (
                let i = Math.max(2, totalPages - maxVisiblePages + 2);
                i <= totalPages - 1;
                i++
            ) {
                pages.push(i);
            }
        } else {
            // Show pages around current
            pages.push("ellipsis");
            for (
                let i = currentPage - halfVisible;
                i <= currentPage + halfVisible;
                i++
            ) {
                pages.push(i);
            }
            pages.push("ellipsis");
        }

        // Always show last page (if different from first)
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav
            className={`flex items-center justify-center space-x-1 ${className}`}
            aria-label="Pagination"
        >
            {/* Previous Arrow */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`
                    flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200
                    ${
                        currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                    }
                `}
                aria-label="Go to previous page"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            {visiblePages.map((page, index) => {
                if (page === "ellipsis") {
                    return (
                        <div
                            key={`ellipsis-${index}`}
                            className="flex items-center justify-center w-10 h-10 text-gray-500"
                            aria-hidden="true"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </div>
                    );
                }

                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`
                            flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200
                            ${
                                currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }
                        `}
                        aria-label={`Go to page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next Arrow */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`
                    flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200
                    ${
                        currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                    }
                `}
                aria-label="Go to next page"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </nav>
    );
};

export default Pagination;
