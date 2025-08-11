import { AdminLayout } from "@client/components/admin/common";
import ProductsPageComponent from "@client/components/admin/products/page";

export default function ProductsPage() {
    return (
        <AdminLayout defaultActiveTab="products">
            <div className="flex flex-col h-full bg-gray-50">
                <main className="flex-1">
                    <ProductsPageComponent />
                </main>
            </div>
        </AdminLayout>
    );
}
