import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { useBookings, useServices, useStaff } from '@/hooks/api';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Users, Calendar, DollarSign, Clock } from 'lucide-react';
export const DashboardPage = () => {
    const { businessId } = useParams();
    const { bookings } = useBookings(businessId);
    const { services } = useServices(businessId);
    const { staff } = useStaff(businessId);
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const todayBookings = bookings.filter((b) => {
        const start = new Date(b.startTimeUtc);
        return start >= todayStart && start <= todayEnd;
    });
    const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED').length;
    const totalRevenue = bookings
        .filter((b) => b.status === 'COMPLETED' || b.status === 'CONFIRMED')
        .reduce((sum, b) => {
        const service = services.find((s) => s.id === b.serviceId);
        return sum + (service?.price || 0);
    }, 0);
    const stats = [
        {
            icon: Calendar,
            label: "Today's Bookings",
            value: todayBookings.length,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            icon: Clock,
            label: 'Confirmed',
            value: confirmedBookings,
            color: 'bg-green-100 text-green-600',
        },
        {
            icon: DollarSign,
            label: 'Total Revenue',
            value: `$${totalRevenue.toFixed(2)}`,
            color: 'bg-purple-100 text-purple-600',
        },
        {
            icon: Users,
            label: 'Active Staff',
            value: staff.filter((s) => s.isActive).length,
            color: 'bg-orange-100 text-orange-600',
        },
    ];
    return (_jsxs("main", { className: "lg:ml-64 p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Dashboard" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: stats.map((stat) => {
                    const Icon = stat.icon;
                    return (_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 text-sm", children: stat.label }), _jsx("p", { className: "text-3xl font-bold mt-2", children: stat.value })] }), _jsx("div", { className: `p-3 rounded-lg ${stat.color}`, children: _jsx(Icon, { size: 24 }) })] }) }, stat.label));
                }) }), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Today's Bookings" }), todayBookings.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "No bookings today" })) : (_jsx("div", { className: "space-y-2", children: todayBookings.map((booking) => (_jsxs("div", { className: "flex justify-between items-center p-3 bg-gray-50 rounded", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: booking.clientName }), _jsxs("p", { className: "text-sm text-gray-600", children: [format(new Date(booking.startTimeUtc), 'HH:mm'), " -", ' ', format(new Date(booking.endTimeUtc), 'HH:mm')] })] }), _jsx("span", { className: `badge-${booking.status.toLowerCase()}`, children: booking.status })] }, booking.id))) }))] })] }));
};
//# sourceMappingURL=DashboardPage.js.map