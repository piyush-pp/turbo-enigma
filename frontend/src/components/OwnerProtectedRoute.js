import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useOwnerAuth } from '@/hooks/useOwnerAuth';
export const OwnerProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useOwnerAuth();
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading..." })] }) }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/owner/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
//# sourceMappingURL=OwnerProtectedRoute.js.map