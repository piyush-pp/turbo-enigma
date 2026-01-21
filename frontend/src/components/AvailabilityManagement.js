import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import { Clock, Save } from 'lucide-react';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const AvailabilityManagement = ({ staffId, businessId, }) => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        fetchAvailability();
    }, [staffId]);
    const fetchAvailability = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/owner/availability/${staffId}`, {
                params: { businessId },
            });
            setRules(response.data || getDefaultRules());
        }
        catch (error) {
            console.error('Failed to fetch availability:', error);
            setRules(getDefaultRules());
        }
        finally {
            setLoading(false);
        }
    };
    const getDefaultRules = () => {
        return Array.from({ length: 7 }, (_, i) => ({
            dayOfWeek: i,
            startTime: '09:00',
            endTime: '17:00',
            isWorkingDay: i < 5, // Mon-Fri
        }));
    };
    const updateRule = (dayOfWeek, field, value) => {
        setRules(rules.map((rule) => rule.dayOfWeek === dayOfWeek ? { ...rule, [field]: value } : rule));
    };
    const handleSave = async () => {
        try {
            setSaving(true);
            await apiClient.put(`/owner/availability/${staffId}`, { rules }, {
                params: { businessId },
            });
            setMessage({ type: 'success', text: 'Availability updated successfully' });
            setTimeout(() => setMessage(null), 3000);
        }
        catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to save availability',
            });
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return _jsx("div", { className: "card", children: "Loading availability..." });
    }
    return (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-6", children: [_jsx(Clock, { size: 24, className: "text-blue-600" }), _jsx("h2", { className: "text-2xl font-bold", children: "Availability Management" })] }), message && (_jsx("div", { className: `p-4 rounded mb-4 ${message.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'}`, children: message.text })), _jsx("div", { className: "space-y-4", children: rules.map((rule) => (_jsx("div", { className: "border rounded-lg p-4 bg-gray-50", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4 items-center", children: [_jsx("div", { children: _jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: DAYS[rule.dayOfWeek] }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-600 mb-1", children: "Start Time" }), _jsx("input", { type: "time", value: rule.startTime, onChange: (e) => updateRule(rule.dayOfWeek, 'startTime', e.target.value), disabled: !rule.isWorkingDay, className: "w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 disabled:opacity-50" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-600 mb-1", children: "End Time" }), _jsx("input", { type: "time", value: rule.endTime, onChange: (e) => updateRule(rule.dayOfWeek, 'endTime', e.target.value), disabled: !rule.isWorkingDay, className: "w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 disabled:opacity-50" })] }), _jsx("div", { className: "flex items-end", children: _jsxs("label", { className: "flex items-center space-x-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: rule.isWorkingDay, onChange: (e) => updateRule(rule.dayOfWeek, 'isWorkingDay', e.target.checked), className: "w-4 h-4 rounded" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Working Day" })] }) })] }) }, rule.dayOfWeek))) }), _jsx("div", { className: "flex justify-end mt-6", children: _jsxs("button", { onClick: handleSave, disabled: saving, className: "flex items-center space-x-2 btn-primary disabled:opacity-50", children: [_jsx(Save, { size: 20 }), _jsx("span", { children: saving ? 'Saving...' : 'Save Changes' })] }) })] }));
};
//# sourceMappingURL=AvailabilityManagement.js.map