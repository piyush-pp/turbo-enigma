import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { format } from 'date-fns';
import { Clock, Mail, Phone } from 'lucide-react';
export const AppointmentCard = ({ booking, onStatusChange }) => {
    const startDate = new Date(booking.startTimeUtc);
    const endDate = new Date(booking.endTimeUtc);
    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return 'badge-success';
            case 'PENDING':
                return 'badge-pending';
            case 'CANCELLED':
                return 'badge-cancelled';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return (_jsxs("div", { className: "card border-l-4 border-blue-500", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg text-gray-900", children: booking.clientName }), _jsx("span", { className: `inline-block mt-2 ${getStatusColor(booking.status)}`, children: booking.status })] }), _jsx("div", { className: "text-sm text-gray-600", children: format(startDate, 'MMM dd, yyyy') })] }), _jsxs("div", { className: "space-y-2 text-sm text-gray-600 mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Clock, { size: 16 }), _jsxs("span", { children: [format(startDate, 'HH:mm'), " - ", format(endDate, 'HH:mm')] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Mail, { size: 16 }), _jsx("span", { children: booking.clientEmail })] }), booking.clientPhone && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Phone, { size: 16 }), _jsx("span", { children: booking.clientPhone })] }))] }), booking.notes && (_jsxs("div", { className: "bg-gray-50 p-3 rounded mb-4 text-sm text-gray-700", children: [_jsx("p", { className: "font-medium mb-1", children: "Notes:" }), _jsx("p", { children: booking.notes })] })), booking.status === 'PENDING' && onStatusChange && (_jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => onStatusChange(booking.id, 'CONFIRMED'), className: "flex-1 btn-primary text-sm", children: "Confirm" }), _jsx("button", { onClick: () => onStatusChange(booking.id, 'CANCELLED'), className: "flex-1 btn-secondary text-sm", children: "Cancel" })] }))] }));
};
//# sourceMappingURL=AppointmentCard.js.map