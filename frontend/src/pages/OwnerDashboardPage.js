import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { OwnerSidebar } from '@/components/OwnerSidebar';
import { OwnerOverview } from './owner/OwnerOverview';
import { BusinessSetup } from './owner/BusinessSetup';
import { ServiceManagement } from './owner/ServiceManagement';
import { StaffManagement } from './owner/StaffManagement';
import { BookingsView } from './owner/BookingsView';
export const OwnerDashboardPage = () => {
    const { businessId, section } = useParams();
    if (!businessId) {
        return _jsx("div", { children: "Invalid business" });
    }
    const renderSection = () => {
        switch (section) {
            case 'business':
                return _jsx(BusinessSetup, { businessId: businessId });
            case 'services':
                return _jsx(ServiceManagement, { businessId: businessId });
            case 'staff':
                return _jsx(StaffManagement, { businessId: businessId });
            case 'bookings':
                return _jsx(BookingsView, { businessId: businessId });
            default:
                return _jsx(OwnerOverview, { businessId: businessId });
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex", children: [_jsx(OwnerSidebar, { businessId: businessId }), _jsx("main", { className: "flex-1 overflow-auto", children: renderSection() })] }));
};
//# sourceMappingURL=OwnerDashboardPage.js.map