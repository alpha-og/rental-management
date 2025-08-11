import { AdminLayout } from "@client/components/admin/common";
import ReportingPageComponent from "@client/components/admin/reporting/page";

export default function ReportingPage() {
    return (
        <AdminLayout defaultActiveTab="reporting">
            <ReportingPageComponent />
        </AdminLayout>
    );
}
