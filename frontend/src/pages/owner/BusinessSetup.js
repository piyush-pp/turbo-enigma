import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getBusiness, updateBusiness } from '@/hooks/useOwnerApi';
import { Save } from 'lucide-react';
export const BusinessSetup = ({ businessId }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        timezone: 'UTC',
        email: '',
        phone: '',
        isSingleStaff: false,
    });
    useEffect(() => {
        const loadBusiness = async () => {
            try {
                const data = await getBusiness(businessId);
                setFormData({
                    name: data.name,
                    description: data.description || '',
                    timezone: data.timezone || 'UTC',
                    email: data.email || '',
                    phone: data.phone || '',
                    isSingleStaff: data.isSingleStaff,
                });
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await updateBusiness(businessId, formData);
            setSuccess('Business settings updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update business');
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return _jsx("div", { className: "p-6", children: "Loading..." });
    }
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Business Setup" }), error && (_jsx("div", { className: "mb-4 p-4 bg-red-100 text-red-800 rounded-lg text-sm", children: error })), success && (_jsx("div", { className: "mb-4 p-4 bg-green-100 text-green-800 rounded-lg text-sm", children: success })), _jsx("div", { className: "bg-white rounded-lg border border-gray-200", children: _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Business Name" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", rows: 4 })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone" }), _jsx("input", { type: "tel", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Timezone" }), _jsxs("select", { value: formData.timezone, onChange: (e) => setFormData({ ...formData, timezone: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "UTC", children: "UTC" }), _jsx("option", { value: "America/New_York", children: "Eastern Time" }), _jsx("option", { value: "America/Chicago", children: "Central Time" }), _jsx("option", { value: "America/Denver", children: "Mountain Time" }), _jsx("option", { value: "America/Los_Angeles", children: "Pacific Time" }), _jsx("option", { value: "Europe/London", children: "London" }), _jsx("option", { value: "Europe/Paris", children: "Paris" }), _jsx("option", { value: "Asia/Tokyo", children: "Tokyo" }), _jsx("option", { value: "Australia/Sydney", children: "Sydney" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "singleStaff", checked: formData.isSingleStaff, onChange: (e) => setFormData({ ...formData, isSingleStaff: e.target.checked }), className: "h-4 w-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("label", { htmlFor: "singleStaff", className: "text-sm font-medium text-gray-700", children: "Single Staff Business (no staff selection during booking)" })] }), _jsxs("button", { type: "submit", disabled: saving, className: "flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors", children: [_jsx(Save, { size: 18 }), _jsx("span", { children: saving ? 'Saving...' : 'Save Changes' })] })] }) })] }));
};
//# sourceMappingURL=BusinessSetup.js.map