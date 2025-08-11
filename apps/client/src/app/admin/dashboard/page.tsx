import AdminDashboard from "@client/components/admin/dashboard/page";
import { AdminLayout } from "@client/components/admin/common";

export default function DashboardPage() {
    return (
        <AdminLayout defaultActiveTab="dashboard">
            <AdminDashboard />
        </AdminLayout>
    );
}
