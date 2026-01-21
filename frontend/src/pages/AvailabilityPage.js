import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { useStaff } from '@/hooks/api';
import { AvailabilityManagement } from '@/components/AvailabilityManagement';
export const AvailabilityPage = () => {
    const { businessId } = useParams();
    const { staff, loading } = useStaff(businessId);
    if (loading) {
        return (_jsxs("main", { className: "lg:ml-64 p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Availability Management" }), _jsx("div", { className: "card text-center py-12", children: "Loading..." })] }));
    }
    const activeStaff = staff.filter((s) => s.isActive);
    return (_jsxs("main", { className: "lg:ml-64 p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Availability Management" }), activeStaff.length === 0 ? (_jsx("div", { className: "card text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "No active staff members" }) })) : (_jsx("div", { className: "space-y-8", children: activeStaff.map((staffMember) => (_jsx(AvailabilityManagement, { staffId: staffMember.id, businessId: businessId }, staffMember.id))) }))] }));
};
//# sourceMappingURL=AvailabilityPage.js.map