import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export const CalendarView = ({ bookings, onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const bookingsByDate = useMemo(() => {
        const map = new Map();
        bookings.forEach((booking) => {
            const dateKey = format(new Date(booking.startTimeUtc), 'yyyy-MM-dd');
            if (!map.has(dateKey)) {
                map.set(dateKey, []);
            }
            map.get(dateKey)?.push(booking);
        });
        return map;
    }, [bookings]);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-2xl font-bold", children: format(currentDate, 'MMMM yyyy') }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)), className: "p-2 hover:bg-gray-100 rounded transition-colors", children: _jsx(ChevronLeft, { size: 20 }) }), _jsx("button", { onClick: () => setCurrentDate(new Date()), className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors", children: "Today" }), _jsx("button", { onClick: () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)), className: "p-2 hover:bg-gray-100 rounded transition-colors", children: _jsx(ChevronRight, { size: 20 }) })] })] }), _jsx("div", { className: "grid grid-cols-7 gap-1 mb-2", children: weekDays.map((day) => (_jsx("div", { className: "h-10 flex items-center justify-center font-semibold text-gray-600", children: day }, day))) }), _jsx("div", { className: "grid grid-cols-7 gap-1", children: days.map((day) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayBookings = bookingsByDate.get(dateKey) || [];
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    return (_jsxs("div", { onClick: () => onDateSelect?.(day), className: `min-h-24 p-2 rounded border cursor-pointer transition-colors ${isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'} ${isToday(day) ? 'bg-blue-50 border-blue-500' : ''} hover:bg-blue-50`, children: [_jsx("div", { className: `text-sm font-medium mb-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`, children: format(day, 'd') }), _jsxs("div", { className: "space-y-1", children: [dayBookings.slice(0, 2).map((booking) => (_jsx("div", { className: "text-xs bg-blue-100 text-blue-800 p-1 rounded truncate", title: booking.clientName, children: booking.clientName }, booking.id))), dayBookings.length > 2 && (_jsxs("div", { className: "text-xs text-gray-600 font-medium", children: ["+", dayBookings.length - 2, " more"] }))] })] }, dateKey));
                }) })] }));
};
//# sourceMappingURL=CalendarView.js.map