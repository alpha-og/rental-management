import RentalPage from "@client/components/admin/rental/page";
import { AdminLayout } from "@client/components/admin/common";

export default function RentalPageRoute() {
    return (
        <AdminLayout defaultActiveTab="rental">
            <RentalPage />
        </AdminLayout>
    );
}
