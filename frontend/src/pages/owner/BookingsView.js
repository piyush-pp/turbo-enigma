import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getBookings, updateBookingStatus } from '@/hooks/useOwnerApi';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
export const BookingsView = ({ businessId }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    useEffect(() => {
        loadBookings();
    }, [businessId]);
    const loadBookings = async () => {
        try {
            const data = await getBookings(businessId);
            setBookings(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load bookings');
        }
        finally {
            setLoading(false);
        }
    };
    const handleStatusChange = async (bookingId, status) => {
        try {
            await updateBookingStatus(bookingId, status);
            await loadBookings();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update booking');
        }
    };
    const filteredBookings = statusFilter === 'all' ? bookings : bookings.filter((b) => b.status === statusFilter);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return _jsx(CheckCircle, { size: 18, className: "text-green-600" });
            case 'pending':
                return _jsx(Clock, { size: 18, className: "text-yellow-600" });
            case 'completed':
                return _jsx(CheckCircle, { size: 18, className: "text-blue-600" });
            default:
                return _jsx(AlertCircle, { size: 18, className: "text-red-600" });
        }
    };
    if (loading) {
        return _jsx("div", { className: "p-6", children: "Loading..." });
    }
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Bookings" }), error && (_jsx("div", { className: "mb-4 p-4 bg-red-100 text-red-800 rounded-lg text-sm", children: error })), _jsx("div", { className: "flex gap-2 mb-6", children: ['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (_jsx("button", { onClick: () => setStatusFilter(status), className: `px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`, children: status.charAt(0).toUpperCase() + status.slice(1) }, status))) }), filteredBookings.length === 0 ? (_jsx("div", { className: "text-center py-12 bg-gray-50 rounded-lg", children: _jsx("p", { className: "text-gray-600", children: "No bookings found" }) })) : (_jsx("div", { className: "space-y-4", children: filteredBookings.map((booking) => (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [getStatusIcon(booking.status), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: booking.clientName }), _jsx("p", { className: "text-sm text-gray-600", children: booking.serviceName })] })] }), _jsx("span", { className: `text-sm px-3 py-1 rounded font-medium ${booking.status === 'confirmed'
                                        ? 'bg-green-100 text-green-800'
                                        : booking.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : booking.status === 'completed'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-red-100 text-red-800'}`, children: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Date & Time" }), _jsx("p", { className: "font-medium text-gray-900", children: formatDate(booking.startTimeUtc) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Staff" }), _jsx("p", { className: "font-medium text-gray-900", children: booking.staffName })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Email" }), _jsx("p", { className: "font-medium text-gray-900 break-all", children: booking.clientEmail })] }), booking.clientPhone && (_jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Phone" }), _jsx("p", { className: "font-medium text-gray-900", children: booking.clientPhone })] }))] }), booking.notes && (_jsxs("div", { className: "mb-4 p-3 bg-gray-50 rounded text-sm", children: [_jsx("p", { className: "text-gray-600 font-medium mb-1", children: "Notes" }), _jsx("p", { className: "text-gray-900", children: booking.notes })] })), booking.status === 'pending' && (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleStatusChange(booking.id, 'confirmed'), className: "flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm font-medium transition-colors", children: "Confirm" }), _jsx("button", { onClick: () => handleStatusChange(booking.id, 'cancelled'), className: "flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm font-medium transition-colors", children: "Cancel" })] }))] }, booking.id))) }))] }));
};
//# sourceMappingURL=BookingsView.js.map