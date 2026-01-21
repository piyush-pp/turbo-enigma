import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check } from 'lucide-react';
export const ServiceSelectionStep = ({ services, selectedServiceId, onSelectService, isLoading = false, }) => {
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }));
    }
    if (services.length === 0) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "No services available" }) }));
    }
    return (_jsx("div", { className: "space-y-3", children: services
            .filter((s) => s.isActive)
            .map((service) => (_jsx("div", { onClick: () => onSelectService(service.id), className: `p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedServiceId === service.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'}`, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: service.name }), service.description && (_jsx("p", { className: "text-sm text-gray-600 mt-1", children: service.description })), _jsxs("div", { className: "flex items-center space-x-4 mt-2", children: [_jsxs("span", { className: "text-sm text-gray-600", children: ["\u23F1\uFE0F ", service.duration, " minutes"] }), _jsxs("span", { className: "font-semibold text-blue-600", children: ["$", service.price.toFixed(2)] })] })] }), selectedServiceId === service.id && (_jsx("div", { className: "flex-shrink-0 ml-4", children: _jsx("div", { className: "flex items-center justify-center h-6 w-6 rounded-full bg-blue-600", children: _jsx(Check, { size: 16, className: "text-white" }) }) }))] }) }, service.id))) }));
};
export const StaffSelectionStep = ({ staff, selectedStaffId, onSelectStaff, isSingleStaff, isLoading = false, }) => {
    // Auto-select if single staff mode
    if (isSingleStaff && staff.length > 0 && !selectedStaffId) {
        // This should be handled by parent
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-600", children: "Staff member will be automatically assigned" }) }));
    }
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }));
    }
    if (staff.length === 0) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "No staff available" }) }));
    }
    return (_jsx("div", { className: "space-y-3", children: staff.map((member) => (_jsx("div", { onClick: () => onSelectStaff(member.id), className: `p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedStaffId === member.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: "Staff Member" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Available for booking" })] }), selectedStaffId === member.id && (_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "flex items-center justify-center h-6 w-6 rounded-full bg-blue-600", children: _jsx(Check, { size: 16, className: "text-white" }) }) }))] }) }, member.id))) }));
};
//# sourceMappingURL=BookingSteps.js.map