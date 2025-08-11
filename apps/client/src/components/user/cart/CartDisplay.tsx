"use client";

import React, { useState, useEffect } from "react";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const CartDisplay = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: 1, name: "Product A", price: 25.0, quantity: 1 },
        { id: 2, name: "Product B", price: 10.5, quantity: 2 },
        { id: 3, name: "Product C", price: 50.0, quantity: 1 },
    ]);

    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const discount = 0;

    useEffect(() => {
        const newSubtotal = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );
        setSubtotal(newSubtotal);
        // Mock tax calculation (e.g., 8% of subtotal)
        const newTax = newSubtotal * 0.08;
        setTax(newTax);
        // Apply discount if any
        const newTotal = newSubtotal + newTax - discount;
        setTotal(newTotal);
    }, [cartItems, discount]);

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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-slate-900">
                Your Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
                <p className="text-slate-600">Your cart is empty.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Cart Items List */}
                    <div className="md:col-span-2">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between border-b border-slate-200 py-4"
                            >
                                <div className="flex items-center">
                                    <div className="w-20 h-20 bg-slate-100 flex items-center justify-center rounded-md mr-4 text-slate-500 text-xs text-center">
                                        Image Placeholder
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-800">
                                            {item.name}
                                        </h2>
                                        <p className="text-slate-600">
                                            Price: ${item.price.toFixed(2)}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        -1,
                                                    )
                                                }
                                                className="bg-slate-100 text-slate-700 px-3 py-1 rounded-l-md hover:bg-slate-200 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-1 border-t border-b border-slate-200 bg-white">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        1,
                                                    )
                                                }
                                                className="bg-slate-100 text-slate-700 px-3 py-1 rounded-r-md hover:bg-slate-200 transition-colors"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleRemoveItem(item.id)
                                                }
                                                className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-lg font-semibold text-slate-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Spacer Column */}
                    <div className="md:col-span-1"></div>
                    {/* Order Summary */}
                    <div className="md:col-span-1 bg-slate-50 p-6 rounded-lg shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold mb-4 text-slate-900">
                            Order Summary
                        </h2>
                        <div className="flex justify-between mb-2 text-slate-700">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2 text-slate-700">
                            <span>Tax (8%):</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between mb-2 text-green-600">
                                <span>Discount:</span>
                                <span>-${discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg border-t border-slate-200 pt-2 mt-2 text-slate-900">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <button className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-md hover:from-indigo-700 hover:to-purple-700 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-md">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartDisplay;
