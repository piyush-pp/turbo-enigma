import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOwnerAuth } from '@/hooks/useOwnerAuth';
import { LayoutDashboard, Settings, Users, Briefcase, Calendar, LogOut, Menu, X, } from 'lucide-react';
export const OwnerSidebar = ({ businessId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useOwnerAuth();
    const menuItems = [
        { path: '', label: 'Overview', icon: LayoutDashboard },
        { path: 'business', label: 'Business Setup', icon: Settings },
        { path: 'services', label: 'Services', icon: Briefcase },
        { path: 'staff', label: 'Staff', icon: Users },
        { path: 'bookings', label: 'Bookings', icon: Calendar },
    ];
    const isActive = (path) => {
        const currentPath = location.pathname.split('/').pop() || '';
        return path === currentPath;
    };
    const handleLogout = () => {
        logout();
        navigate('/owner/login');
    };
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setIsOpen(!isOpen), className: "lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg", children: isOpen ? _jsx(X, { size: 24 }) : _jsx(Menu, { size: 24 }) }), isOpen && (_jsx("div", { className: "lg:hidden fixed inset-0 bg-black/20 z-30", onClick: () => setIsOpen(false) })), _jsx("aside", { className: `fixed lg:static inset-y-0 left-0 w-64 bg-gray-900 text-white z-40 transform lg:transform-none transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`, children: _jsxs("div", { className: "h-full flex flex-col", children: [_jsxs("div", { className: "p-6 border-b border-gray-800", children: [_jsx("h1", { className: "text-2xl font-bold", children: user?.businessName }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: user?.email })] }), _jsx("nav", { className: "flex-1 px-4 py-6", children: _jsx("div", { className: "space-y-2", children: menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (_jsxs("button", { onClick: () => {
                                            navigate(`/owner/${businessId}/${item.path}`);
                                            setIsOpen(false);
                                        }, className: `w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive(item.path)
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800'}`, children: [_jsx(Icon, { size: 20 }), _jsx("span", { children: item.label })] }, item.path));
                                }) }) }), _jsx("div", { className: "p-4 border-t border-gray-800", children: _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg font-medium transition-colors", children: [_jsx(LogOut, { size: 20 }), _jsx("span", { children: "Logout" })] }) })] }) }), _jsx("div", { className: "lg:ml-0" })] }));
};
//# sourceMappingURL=OwnerSidebar.js.map