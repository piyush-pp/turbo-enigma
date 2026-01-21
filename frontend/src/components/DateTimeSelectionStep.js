import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
export const DateTimeSelectionStep = ({ availableSlots, selectedSlot, onSelectSlot, isLoading = false, timezone = 'UTC', }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    // Group slots by date
    const slotsByDate = useMemo(() => {
        const map = new Map();
        availableSlots.forEach((slot) => {
            const dateKey = format(new Date(slot.startTimeUtc), 'yyyy-MM-dd');
            if (!map.has(dateKey)) {
                map.set(dateKey, []);
            }
            map.get(dateKey)?.push(slot);
        });
        return map;
    }, [availableSlots]);
    // Get selected date from selectedSlot or null
    const selectedDate = selectedSlot ? format(new Date(selectedSlot.startTimeUtc), 'yyyy-MM-dd') : null;
    const slotsForSelectedDate = selectedDate ? slotsByDate.get(selectedDate) || [] : [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: format(currentDate, 'MMMM yyyy') }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)), className: "p-2 hover:bg-white rounded transition-colors", children: _jsx(ChevronLeft, { size: 20 }) }), _jsx("button", { onClick: () => setCurrentDate(new Date()), className: "px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors", children: "Today" }), _jsx("button", { onClick: () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)), className: "p-2 hover:bg-white rounded transition-colors", children: _jsx(ChevronRight, { size: 20 }) })] })] }), _jsx("div", { className: "grid grid-cols-7 gap-1 mb-2", children: weekDays.map((day) => (_jsx("div", { className: "h-8 flex items-center justify-center font-semibold text-gray-600 text-sm", children: day }, day))) }), _jsx("div", { className: "grid grid-cols-7 gap-1", children: days.map((day) => {
                            const dateKey = format(day, 'yyyy-MM-dd');
                            const daySlots = slotsByDate.get(dateKey) || [];
                            const isCurrentMonth = isSameMonth(day, currentDate);
                            const hasSlots = daySlots.length > 0;
                            const isSelected = selectedDate === dateKey;
                            return (_jsx("button", { onClick: () => hasSlots && onSelectSlot(daySlots[0]), disabled: !hasSlots, className: `p-2 rounded text-sm font-medium h-12 transition-colors ${!isCurrentMonth
                                    ? 'text-gray-300 bg-gray-50'
                                    : isSelected
                                        ? 'bg-blue-600 text-white'
                                        : hasSlots
                                            ? 'bg-blue-50 text-blue-900 hover:bg-blue-100 cursor-pointer'
                                            : 'text-gray-400 bg-gray-50 cursor-not-allowed'} ${isToday(day) ? 'ring-2 ring-orange-400' : ''}`, children: format(day, 'd') }, dateKey));
                        }) })] }), selectedDate && (_jsxs("div", { children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-3", children: ["Available times for ", format(new Date(selectedDate), 'MMMM d, yyyy')] }), slotsForSelectedDate.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-4", children: "No available slots for this date" })) : (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: slotsForSelectedDate.map((slot, index) => {
                            const startTime = new Date(slot.startTimeUtc);
                            const endTime = new Date(slot.endTimeUtc);
                            const isSelected = selectedSlot?.startTimeUtc === slot.startTimeUtc &&
                                selectedSlot?.endTimeUtc === slot.endTimeUtc;
                            return (_jsx("button", { onClick: () => onSelectSlot(slot), className: `p-3 rounded-lg border-2 transition-all ${isSelected
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 bg-white hover:border-blue-300'}`, children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Clock, { size: 16 }), _jsxs("span", { className: "font-medium", children: [format(startTime, 'HH:mm'), " - ", format(endTime, 'HH:mm')] })] }) }, index));
                        }) }))] }))] }));
};
//# sourceMappingURL=DateTimeSelectionStep.js.map