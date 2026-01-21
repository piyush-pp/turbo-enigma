import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { useBookings } from '@/hooks/api';
import { CalendarView } from '@/components/CalendarView';
import { AppointmentCard } from '@/components/AppointmentCard';
import { useState } from 'react';
import { format, startOfDay, endOfDay } from 'date-fns';
export const CalendarPage = () => {
    const { businessId } = useParams();
    const { bookings } = useBookings(businessId);
    const [selectedDate, setSelectedDate] = useState(null);
    const filteredBookings = selectedDate
        ? bookings.filter((b) => {
            const start = new Date(b.startTimeUtc);
            const dayStart = startOfDay(selectedDate);
            const dayEnd = endOfDay(selectedDate);
            return start >= dayStart && start <= dayEnd;
        })
        : [];
    return (_jsxs("main", { className: "lg:ml-64 p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Calendar" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(CalendarView, { bookings: bookings, onDateSelect: setSelectedDate }) }), _jsxs("div", { className: "space-y-4", children: [selectedDate && (_jsxs("div", { className: "card bg-blue-50 border-l-4 border-blue-600", children: [_jsx("h3", { className: "font-semibold text-lg", children: format(selectedDate, 'MMMM dd, yyyy') }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [filteredBookings.length, " appointment(s)"] })] })), _jsx("div", { className: "space-y-3", children: filteredBookings.map((booking) => (_jsx(AppointmentCard, { booking: booking }, booking.id))) }), selectedDate && filteredBookings.length === 0 && (_jsx("div", { className: "card text-center py-8", children: _jsx("p", { className: "text-gray-500", children: "No appointments on this date" }) }))] })] })] }));
};
//# sourceMappingURL=CalendarPage.js.map