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
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);

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

    const handleApplyCoupon = () => {
        // Mock coupon logic
        if (couponCode === "DISCOUNT10") {
            setDiscount(subtotal * 0.1); // 10% discount
            alert("Coupon applied: 10% off!");
        } else {
            setDiscount(0);
            alert("Invalid coupon code.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Cart Items List */}
                    <div className="md:col-span-2">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between border-b py-4"
                            >
                                <div className="flex items-center">
                                    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md mr-4 text-gray-500 text-xs text-center">
                                        Image Placeholder
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            {item.name}
                                        </h2>
                                        <p className="text-gray-600">
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
                                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-1 border-t border-b">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        1,
                                                    )
                                                }
                                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleRemoveItem(item.id)
                                                }
                                                className="ml-4 text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-lg font-semibold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Spacer Column */}
                    <div className="md:col-span-1"></div>
                    {/* Order Summary */}
                    <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">
                            Order Summary
                        </h2>
                        <div className="flex justify-between mb-2">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Tax (8%):</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between mb-2 text-green-600">
                                <span>Discount:</span>
                                <span>-${discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        {/* Coupon Code Section */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">
                                Coupon Code
                            </h3>
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    className="flex-grow border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={couponCode}
                                    onChange={(e) =>
                                        setCouponCode(e.target.value)
                                    }
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>

                        <button className="mt-6 w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 text-lg font-semibold">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartDisplay;
