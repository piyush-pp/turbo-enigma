import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getServices, createService, updateService, deleteService } from '@/hooks/useOwnerApi';
import { Plus, Trash2, Edit2 } from 'lucide-react';
export const ServiceManagement = ({ businessId }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: 30,
        price: 0,
    });
    useEffect(() => {
        loadServices();
    }, [businessId]);
    const loadServices = async () => {
        try {
            const data = await getServices(businessId);
            setServices(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load services');
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
                await updateService(editingId, formData);
            }
            else {
                await createService(businessId, {
                    name: formData.name,
                    description: formData.description,
                    duration: formData.duration,
                    price: formData.price,
                });
            }
            setFormData({ name: '', description: '', duration: 30, price: 0 });
            setEditingId(null);
            setShowForm(false);
            await loadServices();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save service');
        }
    };
    const handleEdit = (service) => {
        setFormData({
            name: service.name,
            description: service.description,
            duration: service.duration,
            price: service.price,
        });
        setEditingId(service.id);
        setShowForm(true);
    };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this service?'))
            return;
        try {
            await deleteService(id);
            await loadServices();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete service');
        }
    };
    if (loading) {
        return _jsx("div", { className: "p-6", children: "Loading..." });
    }
    return (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Services" }), _jsxs("button", { onClick: () => {
                            setShowForm(!showForm);
                            setEditingId(null);
                            setFormData({ name: '', description: '', duration: 30, price: 0 });
                        }, className: "flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors", children: [_jsx(Plus, { size: 18 }), _jsx("span", { children: "Add Service" })] })] }), error && (_jsx("div", { className: "mb-4 p-4 bg-red-100 text-red-800 rounded-lg text-sm", children: error })), showForm && (_jsxs("div", { className: "mb-6 bg-white rounded-lg border border-gray-200 p-6", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: editingId ? 'Edit Service' : 'New Service' }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Service Name" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("input", { type: "text", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Duration (minutes)" }), _jsx("input", { type: "number", value: formData.duration, onChange: (e) => setFormData({ ...formData, duration: parseInt(e.target.value) }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true, min: "15", step: "15" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Price ($)" }), _jsx("input", { type: "number", value: formData.price, onChange: (e) => setFormData({ ...formData, price: parseFloat(e.target.value) }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true, min: "0", step: "0.01" })] })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { type: "submit", className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors", children: editingId ? 'Update' : 'Create' }), _jsx("button", { type: "button", onClick: () => {
                                            setShowForm(false);
                                            setEditingId(null);
                                            setFormData({ name: '', description: '', duration: 30, price: 0 });
                                        }, className: "bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors", children: "Cancel" })] })] })] })), _jsx("div", { className: "grid gap-4", children: services.length === 0 ? (_jsx("div", { className: "text-center py-12 bg-gray-50 rounded-lg", children: _jsx("p", { className: "text-gray-600", children: "No services yet. Create your first service to get started." }) })) : (services.map((service) => (_jsx("div", { className: "bg-white rounded-lg border border-gray-200 p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: service.name }), service.description && (_jsx("p", { className: "text-sm text-gray-600 mt-1", children: service.description })), _jsxs("div", { className: "flex space-x-4 mt-2 text-sm text-gray-600", children: [_jsxs("span", { children: [service.duration, " min"] }), _jsxs("span", { children: ["$", service.price.toFixed(2)] }), _jsx("span", { className: service.isActive ? 'text-green-600' : 'text-red-600', children: service.isActive ? 'Active' : 'Inactive' })] })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => handleEdit(service), className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(Edit2, { size: 18, className: "text-gray-600" }) }), _jsx("button", { onClick: () => handleDelete(service.id), className: "p-2 hover:bg-red-100 rounded-lg transition-colors", children: _jsx(Trash2, { size: 18, className: "text-red-600" }) })] })] }) }, service.id)))) })] }));
};
//# sourceMappingURL=ServiceManagement.js.map