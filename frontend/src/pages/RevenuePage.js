import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { useBookings, useServices } from '@/hooks/api';
import { RevenueOverview } from '@/components/RevenueOverview';
export const RevenuePage = () => {
    const { businessId } = useParams();
    const { bookings, loading } = useBookings(businessId);
    const { services } = useServices(businessId);
    if (loading) {
        return (_jsxs("main", { className: "lg:ml-64 p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Revenue Overview" }), _jsx("div", { className: "card text-center py-12", children: "Loading..." })] }));
    }
    return (_jsxs("main", { className: "lg:ml-64 p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Revenue Overview" }), _jsx(RevenueOverview, { bookings: bookings, services: services })] }));
};
//# sourceMappingURL=RevenuePage.js.map