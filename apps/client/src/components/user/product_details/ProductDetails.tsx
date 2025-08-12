"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Star,
    Heart,
    Calendar,
    ChevronDown,
    Facebook,
    Twitter,
    Instagram,
    LinkIcon,
} from "lucide-react";
import { Button } from "@client/components/ui/button";

interface ProductDetailsProps {
    productId?: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {
    const [quantity, setQuantity] = useState(2);
    const [couponCode, setCouponCode] = useState("");
    const [selectedDateFrom, setSelectedDateFrom] = useState("");
    const [selectedDateTo, setSelectedDateTo] = useState("");
    const [showPriceList, setShowPriceList] = useState(false);

    // Mock product data - in real app this would come from props or API
    const product = {
        id: productId || "1",
        name: "Product name",
        price: 1000,
        pricePerUnit: 500,
        rating: 4.5,
        reviewCount: 123,
        images: ["/placeholder-product-image.jpg"],
        description: "Product descriptions...",
        termsAndConditions: "Terms & condition...",
        availability: 2,
    };

    const priceList = [
        { duration: "1 day", price: 500 },
        { duration: "3 days", price: 1400 },
        { duration: "1 week", price: 3000 },
        { duration: "1 month", price: 10000 },
    ];

    const handleQuantityChange = (change: number) => {
        setQuantity(
            Math.max(1, Math.min(quantity + change, product.availability)),
        );
    };

    const handleAddToCart = () => {
        // Add to cart logic here
        console.log("Adding to cart:", {
            productId: product.id,
            quantity,
            dateFrom: selectedDateFrom,
            dateTo: selectedDateTo,
        });
    };

    const handleApplyCoupon = () => {
        // Apply coupon logic here
        console.log("Applying coupon:", couponCode);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <nav className="mb-6">
                <div className="flex items-center space-x-2 text-lg text-slate-700">
                    <Link
                        href="/user/products"
                        className="hover:text-indigo-600 cursor-pointer"
                    >
                        All Products
                    </Link>
                    <span>/</span>
                    <span className="text-slate-900">{product.name}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                    breadcrumb are visible also must be clickable
                </p>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="flex justify-center">
                    <div className="w-full max-w-md aspect-square bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 bg-slate-200 rounded-lg flex items-center justify-center">
                                <Heart className="h-8 w-8 text-slate-400" />
                            </div>
                            <span className="text-slate-500 text-sm">
                                Product Image
                            </span>
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    {/* Price List Dropdown */}
                    <div className="flex justify-end">
                        <div className="relative">
                            <Button
                                variant="outline"
                                onClick={() => setShowPriceList(!showPriceList)}
                                className="flex items-center space-x-2"
                            >
                                <span>Price List</span>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${showPriceList ? "rotate-180" : ""}`}
                                />
                            </Button>
                            {showPriceList && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                                    <div className="p-4 space-y-2">
                                        {priceList.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between text-sm"
                                            >
                                                <span>{item.duration}</span>
                                                <span>₹{item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Title and Price */}
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                            {product.name}
                        </h1>
                        <div className="flex items-center space-x-4 text-xl text-slate-900">
                            <span>₹ {product.price}</span>
                            <span className="text-slate-600">
                                (₹{product.pricePerUnit} / per unit)
                            </span>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                        i < Math.floor(product.rating)
                                            ? "text-yellow-400 fill-current"
                                            : "text-slate-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-slate-600">
                            ({product.reviewCount} reviews)
                        </span>
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-4">
                            {product.availability}
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 flex-wrap">
                            <span className="text-lg font-medium">From:</span>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="date"
                                    value={selectedDateFrom}
                                    onChange={(e) =>
                                        setSelectedDateFrom(e.target.value)
                                    }
                                    className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <Calendar className="h-5 w-5 text-slate-400" />
                            </div>
                            <span className="text-lg font-medium">to:</span>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="date"
                                    value={selectedDateTo}
                                    onChange={(e) =>
                                        setSelectedDateTo(e.target.value)
                                    }
                                    className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <Calendar className="h-5 w-5 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* Quantity Selection */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-slate-300 rounded-md">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                                className="px-3 py-2 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
                            >
                                -
                            </button>
                            <span className="px-4 py-2 border-x border-slate-300 bg-white min-w-[50px] text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                disabled={quantity >= product.availability}
                                className="px-3 py-2 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
                            >
                                +
                            </button>
                        </div>
                        <Button
                            onClick={handleAddToCart}
                            className="px-8 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md transition-all duration-300"
                        >
                            Add to Cart
                        </Button>
                    </div>

                    {/* Coupon Section */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-slate-900">
                            Apply Coupon
                        </h3>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Coupon Code"
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <Button
                                onClick={handleApplyCoupon}
                                variant="default"
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-slate-900">
                            Product descriptions
                        </h3>
                        <p className="text-slate-700 leading-relaxed">
                            {product.description}
                        </p>
                        <button className="text-indigo-600 hover:text-purple-600 text-sm">
                            Read More &gt;
                        </button>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-slate-900">
                            Terms & condition
                        </h3>
                        <div className="text-slate-700 space-y-1">
                            <p>...</p>
                            <p>...</p>
                            <p>...</p>
                        </div>
                    </div>

                    {/* Share Section */}
                    <div className="flex items-center space-x-4">
                        <span className="text-lg font-medium text-slate-900">
                            Share:
                        </span>
                        <div className="flex space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-blue-600 hover:text-blue-700"
                            >
                                <Facebook className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-blue-400 hover:text-blue-500"
                            >
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-pink-600 hover:text-pink-700"
                            >
                                <Instagram className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-600 hover:text-slate-700"
                            >
                                <LinkIcon className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Added product to cart notification */}
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">added product on cart</p>
            </div>
        </div>
    );
};

export default ProductDetails;
