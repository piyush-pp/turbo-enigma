import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwnerAuth } from '@/hooks/useOwnerAuth';
import { LogIn } from 'lucide-react';
export const OwnerLoginPage = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, signup } = useOwnerAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignup) {
                const user = await signup(email, password, businessName);
                navigate(`/owner/${user.businessId}`);
            }
            else {
                const user = await login(email, password);
                navigate(`/owner/${user.businessId}`);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 w-full max-w-md", children: [_jsxs("div", { className: "flex items-center justify-center space-x-2 mb-8", children: [_jsx(LogIn, { size: 32, className: "text-blue-600" }), _jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Appoint" })] }), _jsx("h2", { className: "text-2xl font-bold text-center text-gray-900 mb-6", children: isSignup ? 'Create Business Account' : 'Owner Login' }), error && (_jsx("div", { className: "bg-red-100 text-red-800 p-4 rounded-lg mb-6 text-sm", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [isSignup && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Business Name" }), _jsx("input", { type: "text", value: businessName, onChange: (e) => setBusinessName(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Your Business Name", required: true })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "your@email.com", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors", children: loading ? 'Processing...' : isSignup ? 'Create Account' : 'Login' })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: "text-gray-600 text-sm", children: [isSignup ? 'Already have an account?' : "Don't have an account?", ' ', _jsx("button", { onClick: () => {
                                    setIsSignup(!isSignup);
                                    setError('');
                                    setEmail('');
                                    setPassword('');
                                    setBusinessName('');
                                }, className: "text-blue-600 hover:underline font-medium", children: isSignup ? 'Login' : 'Sign Up' })] }) })] }) }));
};
//# sourceMappingURL=OwnerLoginPage.js.map