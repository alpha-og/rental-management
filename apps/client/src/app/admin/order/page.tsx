import { AdminLayout } from "@client/components/admin/common";
import OrderPageComponent from "@client/components/admin/order/page";

export default function OrderPage() {
    return (
        <AdminLayout defaultActiveTab="order">
            <div className="flex flex-col h-full bg-gray-50">
                <main className="flex-1">
                    <OrderPageComponent />
                </main>
            </div>
        </AdminLayout>
    );
}
