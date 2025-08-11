import { AdminLayout } from "@client/components/admin/common";

export default function ProductsPage() {
    return (
        <AdminLayout defaultActiveTab="products">
            <div className="flex flex-col h-full bg-gray-50">
                <header className="bg-white border-b px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Products
                        </h1>
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6">
                    <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Product Management
                        </h2>
                        <p className="text-gray-600">
                            Product management functionality coming soon...
                        </p>
                    </div>
                </main>
            </div>
        </AdminLayout>
    );
}
