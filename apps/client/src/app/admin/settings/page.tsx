import { AdminLayout } from "@client/components/admin/common";
import SettingsComponent from "@client/components/admin/settings/page";

export default function SettingsPage() {
    return (
        <AdminLayout defaultActiveTab="settings">
            <div className="flex flex-col h-full bg-gray-50">
                <header className="bg-white border-b px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Settings
                        </h1>
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6">
                    <SettingsComponent />
                </main>
            </div>
        </AdminLayout>
    );
}
