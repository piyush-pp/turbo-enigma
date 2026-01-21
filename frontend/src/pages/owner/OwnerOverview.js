import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getBusiness } from '@/hooks/useOwnerApi';
import { AlertCircle } from 'lucide-react';
export const OwnerOverview = ({ businessId }) => {
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadBusiness = async () => {
            try {
                const data = await getBusiness(businessId);
                setBusiness(data);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load business');
            }
            finally {
                setLoading(false);
            }
        };
        loadBusiness();
    }, [businessId]);
    if (loading) {
        return _jsx("div", { className: "p-6", children: "Loading..." });
    }
    if (error) {
        return (_jsx("div", { className: "p-6", children: _jsxs("div", { className: "flex items-center space-x-2 text-red-600", children: [_jsx(AlertCircle, { size: 20 }), _jsx("span", { children: error })] }) }));
    }
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: business?.name }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 border border-gray-200", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "Business Information" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Business Name" }), _jsx("p", { className: "font-medium text-gray-900", children: business?.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Slug" }), _jsx("p", { className: "font-medium text-gray-900 break-all", children: business?.slug })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Timezone" }), _jsx("p", { className: "font-medium text-gray-900", children: business?.timezone })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Type" }), _jsx("p", { className: "font-medium text-gray-900", children: business?.isSingleStaff ? 'Single Staff' : 'Multi Staff' })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 border border-gray-200", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "Quick Stats" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Booking URL" }), _jsxs("p", { className: "text-sm font-medium text-blue-600 break-all", children: [window.location.origin, "/booking/", business?.slug] })] }), business?.description && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Description" }), _jsx("p", { className: "text-sm text-gray-900", children: business.description })] }))] })] })] })] }));
};
//# sourceMappingURL=OwnerOverview.js.map