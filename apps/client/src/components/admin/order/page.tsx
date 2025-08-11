"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@client/components/ui/button";
import { Input } from "@client/components/ui/input";
import {
    Search,
    Grid,
    List,
    Plus,
    Filter,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
} from "lucide-react";
import {
    getOrderList,
    createNewOrder,
    type OrderData,
} from "@client/app/admin/order/api";

// Status badge components
const StatusBadge = ({ status }: { status: OrderData["rentalStatus"] }) => {
    const getStatusConfig = (status: OrderData["rentalStatus"]) => {
        switch (status) {
            case "quotation":
                return {
                    color: "bg-yellow-100 text-yellow-800",
                    text: "Quotation",
                };
            case "reserved":
                return { color: "bg-blue-100 text-blue-800", text: "Reserved" };
            case "delivered":
                return {
                    color: "bg-green-100 text-green-800",
                    text: "Delivered",
                };
            case "returned":
                return { color: "bg-gray-100 text-gray-800", text: "Returned" };
            default:
                return { color: "bg-gray-100 text-gray-800", text: "Unknown" };
        }
    };

    const config = getStatusConfig(status);
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
        >
            {config.text}
        </span>
    );
};

const InvoiceStatusBadge = ({
    status,
}: {
    status: OrderData["invoiceStatus"];
}) => {
    const getStatusConfig = (status: OrderData["invoiceStatus"]) => {
        switch (status) {
            case "fully_invoiced":
                return {
                    color: "bg-green-100 text-green-800",
                    text: "Fully Invoiced",
                };
            case "nothing_to_invoice":
                return {
                    color: "bg-gray-100 text-gray-800",
                    text: "Nothing to Invoice",
                };
            case "to_invoice":
                return {
                    color: "bg-orange-100 text-orange-800",
                    text: "To Invoice",
                };
            default:
                return { color: "bg-gray-100 text-gray-800", text: "Unknown" };
        }
    };

    const config = getStatusConfig(status);
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
        >
            {config.text}
        </span>
    );
};

// Card view component
const OrderCard = ({
    order,
    onView,
    onEdit,
    onDelete,
}: {
    order: OrderData;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {order.id}
                    </h3>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            console.log("View order:", order.id);
                            onView(order.id);
                        }}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            console.log("Edit order:", order.id);
                            onEdit(order.id);
                        }}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            console.log("Delete order:", order.id);
                            onDelete(order.id);
                        }}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="font-medium">
                        ${order.amount.toLocaleString()}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Created By:</span>
                    <span className="text-sm">{order.createdBy}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <StatusBadge status={order.rentalStatus} />
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Invoice:</span>
                    <InvoiceStatusBadge status={order.invoiceStatus} />
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium text-gray-900">
                        Total:
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                        ${order.total.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

// List view component
const OrderTable = ({
    orders,
    selectedOrders,
    onSelectOrder,
    onSelectAll,
    onView,
    onEdit,
    onDelete,
}: {
    orders: OrderData[];
    selectedOrders: string[];
    onSelectOrder: (id: string) => void;
    onSelectAll: (checked: boolean) => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="w-12 p-4">
                                <input
                                    type="checkbox"
                                    checked={
                                        selectedOrders.length ===
                                            orders.length && orders.length > 0
                                    }
                                    onChange={(e) =>
                                        onSelectAll(e.target.checked)
                                    }
                                    className="rounded border-gray-300"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Invoice Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="w-12 p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.includes(
                                            order.id,
                                        )}
                                        onChange={() => onSelectOrder(order.id)}
                                        className="rounded border-gray-300"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.customer}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${order.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.createdBy}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={order.rentalStatus} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <InvoiceStatusBadge
                                        status={order.invoiceStatus}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ${order.total.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                console.log(
                                                    "View order:",
                                                    order.id,
                                                );
                                                onView(order.id);
                                            }}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                console.log(
                                                    "Edit order:",
                                                    order.id,
                                                );
                                                onEdit(order.id);
                                            }}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                console.log(
                                                    "Delete order:",
                                                    order.id,
                                                );
                                                onDelete(order.id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Main order page component
const OrderPage = () => {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"card" | "list">("card");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Load orders on component mount
    useEffect(() => {
        void loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await getOrderList();
            setOrders(response.orders);
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNewOrder = async () => {
        try {
            console.log("Creating new order...");
            const newOrder = await createNewOrder();
            setOrders((prev) => [newOrder, ...prev]);
            console.log("New order created:", newOrder);
            alert(`New order ${newOrder.id} created successfully!`);
        } catch (error) {
            console.error("Failed to create new order:", error);
            alert("Failed to create new order. Please try again.");
        }
    };

    const handleViewOrder = (orderId: string) => {
        console.log("Viewing order:", orderId);
        const order = orders.find((o) => o.id === orderId);
        if (order) {
            alert(
                `Viewing Order: ${order.id}\nCustomer: ${order.customer}\nAmount: $${order.amount.toLocaleString()}\nStatus: ${order.rentalStatus}\nInvoice Status: ${order.invoiceStatus}`,
            );
        }
    };

    const handleEditOrder = (orderId: string) => {
        console.log("Editing order:", orderId);
        const order = orders.find((o) => o.id === orderId);
        if (order) {
            const newCustomer = prompt("Edit customer name:", order.customer);
            if (newCustomer && newCustomer !== order.customer) {
                setOrders((prev) =>
                    prev.map((o) =>
                        o.id === orderId ? { ...o, customer: newCustomer } : o,
                    ),
                );
                alert(`Order ${orderId} updated successfully!`);
            }
        }
    };

    const handleDeleteOrder = (orderId: string) => {
        console.log("Deleting order:", orderId);
        const order = orders.find((o) => o.id === orderId);
        if (
            order &&
            confirm(
                `Are you sure you want to delete order ${orderId} for ${order.customer}?`,
            )
        ) {
            setOrders((prev) => prev.filter((order) => order.id !== orderId));
            setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
            alert(`Order ${orderId} deleted successfully!`);
        }
    };

    const handleExportOrders = () => {
        console.log("Exporting orders...");
        const ordersToExport =
            selectedOrders.length > 0
                ? orders.filter((order) => selectedOrders.includes(order.id))
                : filteredOrders;

        // Create CSV content
        const headers = [
            "Order ID",
            "Customer",
            "Amount",
            "Created By",
            "Status",
            "Invoice Status",
            "Total",
        ];
        const csvContent = [
            headers.join(","),
            ...ordersToExport.map((order) =>
                [
                    order.id,
                    `"${order.customer}"`,
                    order.amount,
                    `"${order.createdBy}"`,
                    order.rentalStatus,
                    order.invoiceStatus,
                    order.total,
                ].join(","),
            ),
        ].join("\n");

        // Create and download file
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `orders_export_${new Date().toISOString().split("T")[0]}.csv`,
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert(`Exported ${ordersToExport.length} orders to CSV file!`);
    };

    const handleDeleteSelected = () => {
        console.log("Deleting selected orders...");
        if (selectedOrders.length === 0) {
            alert("No orders selected for deletion.");
            return;
        }

        const selectedOrdersData = orders.filter((order) =>
            selectedOrders.includes(order.id),
        );
        const ordersList = selectedOrdersData
            .map((order) => `${order.id} (${order.customer})`)
            .join("\n");

        if (
            confirm(
                `Are you sure you want to delete ${selectedOrders.length} selected order(s)?\n\n${ordersList}`,
            )
        ) {
            setOrders((prev) =>
                prev.filter((order) => !selectedOrders.includes(order.id)),
            );
            setSelectedOrders([]);
            alert(`${selectedOrdersData.length} orders deleted successfully!`);
        }
    };

    const handleSelectOrder = (orderId: string) => {
        setSelectedOrders((prev) =>
            prev.includes(orderId)
                ? prev.filter((id) => id !== orderId)
                : [...prev, orderId],
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedOrders(filteredOrders.map((order) => order.id));
        } else {
            setSelectedOrders([]);
        }
    };

    const handleToggleFilter = () => {
        const filters = [
            "all",
            "quotation",
            "reserved",
            "delivered",
            "returned",
        ];
        const currentIndex = filters.indexOf(statusFilter);
        const nextIndex = (currentIndex + 1) % filters.length;
        setStatusFilter(filters[nextIndex]);
    };

    // Filter orders based on search term and status filter
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.createdBy.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || order.rentalStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600">
                        Manage rental orders and track their status
                    </p>
                </div>
                <Button
                    onClick={() => void handleCreateNewOrder()}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    New Order
                </Button>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={handleToggleFilter}
                    >
                        <Filter className="h-4 w-4" />
                        {statusFilter === "all"
                            ? "All"
                            : statusFilter.charAt(0).toUpperCase() +
                              statusFilter.slice(1)}
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={handleExportOrders}
                    >
                        Export All
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === "card" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("card")}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Bulk actions (shown when orders are selected) */}
            {selectedOrders.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-blue-700 font-medium">
                        {selectedOrders.length} order
                        {selectedOrders.length !== 1 ? "s" : ""} selected
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportOrders}
                        >
                            Export
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteSelected}
                        >
                            Delete Selected
                        </Button>
                    </div>
                </div>
            )}

            {/* Orders display */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <List className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No orders found
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm
                            ? "Try adjusting your search terms"
                            : "Get started by creating your first order"}
                    </p>
                    {!searchTerm && (
                        <Button
                            onClick={() => void handleCreateNewOrder()}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Create First Order
                        </Button>
                    )}
                </div>
            ) : viewMode === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onView={handleViewOrder}
                            onEdit={handleEditOrder}
                            onDelete={handleDeleteOrder}
                        />
                    ))}
                </div>
            ) : (
                <OrderTable
                    orders={filteredOrders}
                    selectedOrders={selectedOrders}
                    onSelectOrder={handleSelectOrder}
                    onSelectAll={handleSelectAll}
                    onView={handleViewOrder}
                    onEdit={handleEditOrder}
                    onDelete={handleDeleteOrder}
                />
            )}

            {/* Pagination (placeholder) */}
            {filteredOrders.length > 0 && (
                <div className="flex items-center justify-between pt-6 border-t">
                    <div className="text-sm text-gray-600">
                        Showing {filteredOrders.length} of {orders.length}{" "}
                        orders
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderPage;
