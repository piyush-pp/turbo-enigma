import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/api';
import { UserPlus } from 'lucide-react';
export const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        businessName: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await apiClient.post('/auth/signup', formData);
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('businessId', response.data.businessId);
            navigate(`/dashboard/${response.data.businessId}`);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 w-full max-w-md", children: [_jsxs("div", { className: "flex items-center justify-center space-x-2 mb-8", children: [_jsx(UserPlus, { size: 32, className: "text-blue-600" }), _jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Appoint" })] }), _jsx("h2", { className: "text-2xl font-bold text-center text-gray-900 mb-6", children: "Get Started" }), error && (_jsx("div", { className: "bg-red-100 text-red-800 p-4 rounded-lg mb-6", children: error })), _jsxs("form", { onSubmit: handleSignup, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Full Name" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600", placeholder: "John Doe" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Business Name" }), _jsx("input", { type: "text", name: "businessName", value: formData.businessName, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600", placeholder: "My Salon" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600", placeholder: "you@example.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, required: true, minLength: 8, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Minimum 8 characters" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium", children: loading ? 'Creating account...' : 'Create Account' })] }), _jsxs("p", { className: "text-center text-gray-600 text-sm mt-4", children: ["Already have an account?", ' ', _jsx("a", { href: "/login", className: "text-blue-600 hover:underline", children: "Login here" })] })] }) }));
};
//# sourceMappingURL=SignupPage.js.map