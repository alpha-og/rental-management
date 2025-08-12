"use client";

import React from "react";

interface ProductDetailsProps {
    productId?: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {
    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Product Details</h1>
            <p>Product ID: {productId || "No ID provided"}</p>
            <p>This is a placeholder for the product details component.</p>
        </div>
    );
};

export default ProductDetails;
