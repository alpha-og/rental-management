"use client";
import React from "react";
import { Star } from "lucide-react";

interface Product {
    id: number;
    name: string;
    price: number;
    rating: number;
    image?: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">Product {product.id}</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">{product.name}</h4>
            <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center">
                    {[...Array<number>(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                            }`}
                        />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                        ({product.rating})
                    </span>
                </div>
            </div>
        </div>
    );
};

interface ProductGridProps {
    products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export { ProductCard, ProductGrid };
export type { Product };
