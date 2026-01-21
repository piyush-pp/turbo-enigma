import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
export const RevenueOverview = ({ bookings, services }) => {
    // Calculate revenue by day
    const revenueByDay = bookings.reduce((acc, booking) => {
        if (booking.status !== 'COMPLETED' && booking.status !== 'CONFIRMED')
            return acc;
        const date = new Date(booking.startTimeUtc);
        const dateKey = date.toLocaleDateString();
        const service = services.find((s) => s.id === booking.serviceId);
        const price = service?.price || 0;
        const existing = acc.find((item) => item.date === dateKey);
        if (existing) {
            existing.revenue += price;
        }
        else {
            acc.push({ date: dateKey, revenue: price });
        }
        return acc;
    }, []);
    // Calculate status distribution
    const statusDistribution = [
        { name: 'Confirmed', value: bookings.filter((b) => b.status === 'CONFIRMED').length },
        { name: 'Pending', value: bookings.filter((b) => b.status === 'PENDING').length },
        { name: 'Completed', value: bookings.filter((b) => b.status === 'COMPLETED').length },
        { name: 'Cancelled', value: bookings.filter((b) => b.status === 'CANCELLED').length },
    ];
    const totalRevenue = revenueByDay.reduce((sum, item) => sum + item.revenue, 0);
    const avgBookingValue = bookings.length > 0 ? totalRevenue / bookings.length : 0;
    const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "card", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Total Revenue" }), _jsxs("p", { className: "text-3xl font-bold text-green-600 mt-2", children: ["$", totalRevenue.toFixed(2)] })] }), _jsxs("div", { className: "card", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Average Booking Value" }), _jsxs("p", { className: "text-3xl font-bold text-blue-600 mt-2", children: ["$", avgBookingValue.toFixed(2)] })] }), _jsxs("div", { className: "card", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Total Bookings" }), _jsx("p", { className: "text-3xl font-bold text-purple-600 mt-2", children: bookings.length })] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Revenue Trend" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: revenueByDay.slice(-30), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, { formatter: (value) => `$${value}` }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "revenue", stroke: "#2563eb", strokeWidth: 2 })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Booking Status" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: statusDistribution, cx: "50%", cy: "50%", labelLine: false, label: ({ name, value }) => `${name}: ${value}`, outerRadius: 100, fill: "#8884d8", dataKey: "value", children: statusDistribution.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Booking Breakdown" }), _jsx("div", { className: "space-y-3", children: statusDistribution.map((item, index) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-4 h-4 rounded", style: { backgroundColor: COLORS[index] } }), _jsx("span", { className: "text-gray-700", children: item.name })] }), _jsx("span", { className: "font-semibold", children: item.value })] }, item.name))) })] })] })] }));
};
//# sourceMappingURL=RevenueOverview.js.map