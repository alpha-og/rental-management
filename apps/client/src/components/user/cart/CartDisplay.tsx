"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    description?: string;
}

const CartDisplay = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: "Wireless Bluetooth Headphones",
            price: 89.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center",
            description:
                "High-quality wireless headphones with noise cancellation",
        },
        {
            id: 2,
            name: "Smart Fitness Watch",
            price: 199.5,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center",
            description: "Advanced fitness tracking with heart rate monitor",
        },
        {
            id: 3,
            name: "USB-C Charging Cable",
            price: 24.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center",
            description: "Fast charging USB-C cable, 6ft length",
        },
        {
            id: 4,
            name: "Portable Speaker",
            price: 149.0,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center",
            description:
                "Waterproof Bluetooth speaker with 12-hour battery life",
        },
    ]);

    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
        {},
    );

    useEffect(() => {
        const newSubtotal = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );
        setSubtotal(newSubtotal);

        // Calculate tax (8% of subtotal)
        const newTax = newSubtotal * 0.08;
        setTax(newTax);

        // Calculate total
        const newTotal = newSubtotal + newTax;
        setTotal(newTotal);
    }, [cartItems]);

    const handleQuantityChange = (id: number, change: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item,
            ),
        );
    };

    const handleRemoveItem = (id: number) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const handleContinueShopping = () => {
        router.push("/user");
    };

    const handleImageError = (id: number) => {
        setImageErrors((prev) => ({ ...prev, [id]: true }));
    };

    const ImagePlaceholder = () => (
        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-sm font-medium">
            <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 opacity-50">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <span>No Image</span>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-slate-900">
                    Your Shopping Cart
                </h1>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-4 text-slate-300">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6V5a2 2 0 114 0v1H8zm0 2.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-700 mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-slate-600 mb-6">
                        Looks like you haven&apos;t added any items to your cart
                        yet.
                    </p>
                    <button
                        onClick={handleContinueShopping}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start space-x-4">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                        {imageErrors[item.id] ? (
                                            <ImagePlaceholder />
                                        ) : (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={() =>
                                                    handleImageError(item.id)
                                                }
                                                loading="lazy"
                                            />
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h2 className="text-lg font-semibold text-slate-800 truncate">
                                                    {item.name}
                                                </h2>
                                                {item.description && (
                                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleRemoveItem(item.id)
                                                }
                                                className="text-slate-400 hover:text-red-500 transition-colors p-1 ml-2"
                                                title="Remove item"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg font-semibold text-slate-900">
                                                    ${item.price.toFixed(2)}
                                                </span>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center border border-slate-300 rounded-lg">
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.id,
                                                                -1,
                                                            )
                                                        }
                                                        className="px-3 py-1 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors rounded-l-lg"
                                                        disabled={
                                                            item.quantity <= 1
                                                        }
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-4 py-1 border-l border-r border-slate-300 bg-slate-50 font-medium min-w-[3rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.id,
                                                                1,
                                                            )
                                                        }
                                                        className="px-3 py-1 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors rounded-r-lg"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-xl font-bold text-slate-900">
                                                $
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-4">
                            <h2 className="text-xl font-bold mb-6 text-slate-900">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-700">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-slate-700">
                                    <span>Shipping:</span>
                                    <span className="font-medium text-green-600">
                                        Free
                                    </span>
                                </div>

                                <div className="flex justify-between text-slate-700">
                                    <span>Tax (8%):</span>
                                    <span className="font-medium">
                                        ${tax.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4 mb-6">
                                <div className="flex justify-between font-bold text-xl text-slate-900">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg mb-3">
                                Generate Quotation
                            </button>

                            <button
                                onClick={handleContinueShopping}
                                className="w-full border border-slate-300 text-slate-700 py-3 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                            >
                                Continue Shopping
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <div className="flex items-center justify-center space-x-4 text-sm text-slate-600">
                                    <div className="flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-1 text-green-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Secure Checkout
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartDisplay;
