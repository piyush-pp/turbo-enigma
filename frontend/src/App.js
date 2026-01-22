import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { OwnerProtectedRoute } from '@/components/OwnerProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { DashboardPage } from '@/pages/DashboardPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { AppointmentsPage } from '@/pages/AppointmentsPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { RevenuePage } from '@/pages/RevenuePage';
import { AvailabilityPage } from '@/pages/AvailabilityPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { PublicHomePage } from '@/pages/PublicHomePage';
import { PublicBookingPage } from '@/pages/PublicBookingPage';
import { OwnerLoginPage } from '@/pages/OwnerLoginPage';
import { OwnerDashboardPage } from '@/pages/OwnerDashboardPage';
import '@/index.css';
function DashboardLayout() {
    const { businessId } = useParams();
    if (!businessId) {
        return _jsx("div", { children: "Invalid business ID" });
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Sidebar, { businessId: businessId }), _jsx("div", { className: "lg:pl-0", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/calendar", element: _jsx(CalendarPage, {}) }), _jsx(Route, { path: "/appointments", element: _jsx(AppointmentsPage, {}) }), _jsx(Route, { path: "/customers", element: _jsx(CustomersPage, {}) }), _jsx(Route, { path: "/revenue", element: _jsx(RevenuePage, {}) }), _jsx(Route, { path: "/availability", element: _jsx(AvailabilityPage, {}) })] }) })] }));
}
function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(PublicHomePage, {}) }), _jsx(Route, { path: "/booking/:businessSlug", element: _jsx(PublicBookingPage, {}) }), _jsx(Route, { path: "/owner/login", element: _jsx(OwnerLoginPage, {}) }), _jsx(Route, { path: "/owner/:businessId/*", element: _jsx(OwnerProtectedRoute, { children: _jsx(OwnerDashboardPage, {}) }) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignupPage, {}) }), _jsx(Route, { path: "/dashboard/:businessId/*", element: _jsx(ProtectedRoute, { children: _jsx(DashboardLayout, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
export default App;
//# sourceMappingURL=App.js.map