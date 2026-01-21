import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getStaffList, createStaff, updateStaff, deleteStaff } from '@/hooks/useOwnerApi';
import { Plus, Trash2, Edit2 } from 'lucide-react';
export const StaffManagement = ({ businessId }) => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    useEffect(() => {
        loadStaff();
    }, [businessId]);
    const loadStaff = async () => {
        try {
            const data = await getStaffList(businessId);
            setStaff(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load staff');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingId) {
                await updateStaff(editingId, formData);
            }
            else {
                await createStaff(businessId, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                });
            }
            setFormData({ firstName: '', lastName: '', email: '', phone: '' });
            setEditingId(null);
            setShowForm(false);
            await loadStaff();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save staff member');
        }
    };
    const handleEdit = (member) => {
        setFormData({
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            phone: member.phone || '',
        });
        setEditingId(member.id);
        setShowForm(true);
    };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this staff member?'))
            return;
        try {
            await deleteStaff(id);
            await loadStaff();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete staff member');
        }
    };
    if (loading) {
        return _jsx("div", { className: "p-6", children: "Loading..." });
    }
    return (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Staff" }), _jsxs("button", { onClick: () => {
                            setShowForm(!showForm);
                            setEditingId(null);
                            setFormData({ firstName: '', lastName: '', email: '', phone: '' });
                        }, className: "flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors", children: [_jsx(Plus, { size: 18 }), _jsx("span", { children: "Add Staff" })] })] }), error && (_jsx("div", { className: "mb-4 p-4 bg-red-100 text-red-800 rounded-lg text-sm", children: error })), showForm && (_jsxs("div", { className: "mb-6 bg-white rounded-lg border border-gray-200 p-6", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: editingId ? 'Edit Staff Member' : 'Add Staff Member' }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "First Name" }), _jsx("input", { type: "text", value: formData.firstName, onChange: (e) => setFormData({ ...formData, firstName: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Last Name" }), _jsx("input", { type: "text", value: formData.lastName, onChange: (e) => setFormData({ ...formData, lastName: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone (optional)" }), _jsx("input", { type: "tel", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { type: "submit", className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors", children: editingId ? 'Update' : 'Add' }), _jsx("button", { type: "button", onClick: () => {
                                            setShowForm(false);
                                            setEditingId(null);
                                            setFormData({ firstName: '', lastName: '', email: '', phone: '' });
                                        }, className: "bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors", children: "Cancel" })] })] })] })), _jsx("div", { className: "grid gap-4", children: staff.length === 0 ? (_jsx("div", { className: "text-center py-12 bg-gray-50 rounded-lg", children: _jsx("p", { className: "text-gray-600", children: "No staff members yet. Add your first staff member to get started." }) })) : (staff.map((member) => (_jsx("div", { className: "bg-white rounded-lg border border-gray-200 p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs("h3", { className: "font-semibold text-gray-900", children: [member.firstName, " ", member.lastName] }), _jsxs("div", { className: "space-y-1 mt-2 text-sm text-gray-600", children: [_jsxs("p", { children: ["Email: ", member.email] }), member.phone && _jsxs("p", { children: ["Phone: ", member.phone] })] }), _jsx("div", { className: "mt-2", children: _jsx("span", { className: `text-sm px-2 py-1 rounded ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: member.isActive ? 'Active' : 'Inactive' }) })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => handleEdit(member), className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(Edit2, { size: 18, className: "text-gray-600" }) }), _jsx("button", { onClick: () => handleDelete(member.id), className: "p-2 hover:bg-red-100 rounded-lg transition-colors", children: _jsx(Trash2, { size: 18, className: "text-red-600" }) })] })] }) }, member.id)))) })] }));
};
//# sourceMappingURL=StaffManagement.js.map