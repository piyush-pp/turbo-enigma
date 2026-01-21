import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, DollarSign, Clock, LogOut, Menu, X, } from 'lucide-react';
import { useState } from 'react';
export const Sidebar = ({ businessId }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: `/dashboard/${businessId}` },
        { icon: Calendar, label: 'Calendar', href: `/dashboard/${businessId}/calendar` },
        { icon: Users, label: 'Appointments', href: `/dashboard/${businessId}/appointments` },
        { icon: Users, label: 'Customers', href: `/dashboard/${businessId}/customers` },
        { icon: DollarSign, label: 'Revenue', href: `/dashboard/${businessId}/revenue` },
        { icon: Clock, label: 'Availability', href: `/dashboard/${businessId}/availability` },
    ];
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    };
    const isActive = (href) => location.pathname === href;
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setIsOpen(!isOpen), className: "fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-md", children: isOpen ? _jsx(X, { size: 24 }) : _jsx(Menu, { size: 24 }) }), _jsxs("aside", { className: `fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white transform transition-transform duration-300 z-40 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`, children: [_jsxs("div", { className: "p-6 border-b border-gray-800", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Appoint" }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Dashboard" })] }), _jsx("nav", { className: "p-4 space-y-2", children: navItems.map((item) => {
                            const Icon = item.icon;
                            return (_jsxs(Link, { to: item.href, onClick: () => setIsOpen(false), className: `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.href)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'}`, children: [_jsx(Icon, { size: 20 }), _jsx("span", { children: item.label })] }, item.href));
                        }) }), _jsx("div", { className: "absolute bottom-4 left-4 right-4", children: _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors", children: [_jsx(LogOut, { size: 20 }), _jsx("span", { children: "Logout" })] }) })] }), isOpen && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden", onClick: () => setIsOpen(false) }))] }));
};
//# sourceMappingURL=Sidebar.js.map