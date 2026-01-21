import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { useBookings } from '@/hooks/api';
import { AppointmentCard } from '@/components/AppointmentCard';
import { useState } from 'react';
import { Filter } from 'lucide-react';
export const AppointmentsPage = () => {
    const { businessId } = useParams();
    const [filterStatus, setFilterStatus] = useState('ALL');
    const { bookings, updateBooking, loading } = useBookings(businessId, {
        status: filterStatus === 'ALL' ? undefined : filterStatus,
    });
    const statuses = [
        { value: 'ALL', label: 'All' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'CONFIRMED', label: 'Confirmed' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' },
    ];
    const handleStatusChange = async (bookingId, status) => {
        try {
            await updateBooking(bookingId, status);
        }
        catch (error) {
            console.error('Failed to update booking:', error);
        }
    };
    const displayBookings = filterStatus === 'ALL'
        ? bookings
        : bookings.filter((b) => b.status === filterStatus);
    return (_jsxs("main", { className: "lg:ml-64 p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Appointments" }), _jsxs("div", { className: "card mb-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx(Filter, { size: 20, className: "text-gray-600" }), _jsx("h2", { className: "font-semibold", children: "Filter by Status" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: statuses.map((status) => (_jsx("button", { onClick: () => setFilterStatus(status.value), className: `px-4 py-2 rounded-lg transition-colors ${filterStatus === status.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`, children: status.label }, status.value))) })] }), loading && _jsx("div", { className: "card text-center py-8", children: "Loading appointments..." }), !loading && displayBookings.length === 0 ? (_jsx("div", { className: "card text-center py-12", children: _jsx("p", { className: "text-gray-500 text-lg", children: "No appointments found" }) })) : (_jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: displayBookings.map((booking) => (_jsx(AppointmentCard, { booking: booking, onStatusChange: handleStatusChange }, booking.id))) }))] }));
};
//# sourceMappingURL=AppointmentsPage.js.map