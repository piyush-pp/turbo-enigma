import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { useBookings } from '@/hooks/api';
import { useState, useMemo } from 'react';
import { Mail, Phone, User } from 'lucide-react';
export const CustomersPage = () => {
    const { businessId } = useParams();
    const { bookings } = useBookings(businessId);
    const [searchTerm, setSearchTerm] = useState('');
    const customers = useMemo(() => {
        const customerMap = new Map();
        bookings.forEach((booking) => {
            const key = booking.clientEmail;
            if (!customerMap.has(key)) {
                customerMap.set(key, {
                    id: booking.id,
                    email: booking.clientEmail,
                    name: booking.clientName,
                    phone: booking.clientPhone,
                    bookingsCount: 0,
                    totalSpent: 0,
                });
            }
        });
        return Array.from(customerMap.values())
            .sort((a, b) => b.bookingsCount - a.bookingsCount);
    }, [bookings]);
    const filteredCustomers = customers.filter((customer) => customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsxs("main", { className: "lg:ml-64 p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Customers" }), _jsx("div", { className: "card mb-6", children: _jsx("input", { type: "text", placeholder: "Search by name or email...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" }) }), filteredCustomers.length === 0 ? (_jsx("div", { className: "card text-center py-12", children: _jsx("p", { className: "text-gray-500 text-lg", children: "No customers found" }) })) : (_jsx("div", { className: "grid grid-cols-1 gap-4", children: filteredCustomers.map((customer) => (_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-3", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center", children: _jsx(User, { size: 24, className: "text-blue-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg", children: customer.name }), _jsxs("div", { className: "flex items-center space-x-2 text-sm text-gray-600", children: [_jsx(Mail, { size: 16 }), _jsx("span", { children: customer.email })] })] })] }), customer.phone && (_jsxs("div", { className: "flex items-center space-x-2 text-sm text-gray-600 mb-3", children: [_jsx(Phone, { size: 16 }), _jsx("span", { children: customer.phone })] }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-center", children: [_jsxs("div", { className: "bg-gray-50 p-3 rounded", children: [_jsx("p", { className: "text-2xl font-bold text-blue-600", children: bookings.filter((b) => b.clientEmail === customer.email).length }), _jsx("p", { className: "text-xs text-gray-600", children: "Bookings" })] }), _jsxs("div", { className: "bg-gray-50 p-3 rounded", children: [_jsxs("p", { className: "text-2xl font-bold text-green-600", children: ["$", bookings
                                                        .filter((b) => b.clientEmail === customer.email)
                                                        .reduce((sum) => sum + 50, 0) // Placeholder, use actual service prices
                                                        .toFixed(0)] }), _jsx("p", { className: "text-xs text-gray-600", children: "Spent" })] })] })] }) }, customer.email))) }))] }));
};
//# sourceMappingURL=CustomersPage.js.map