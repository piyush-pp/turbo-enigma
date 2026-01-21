import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, AlertCircle } from 'lucide-react';
export const PublicHomePage = () => {
    const [businessSlug, setBusinessSlug] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleBooking = async (e) => {
        e.preventDefault();
        setError('');
        if (!businessSlug.trim()) {
            setError('Please enter a business name');
            return;
        }
        // Convert to slug format
        const slug = businessSlug.toLowerCase().trim().replace(/\s+/g, '-');
        setLoading(true);
        try {
            // Navigate to booking page (backend will validate slug exists)
            navigate(`/booking/${slug}`);
        }
        catch (err) {
            setError('Failed to navigate to booking page');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50", children: [_jsx("nav", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Calendar, { size: 32, className: "text-blue-600" }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Appoint" })] }), _jsx("p", { className: "text-gray-600 hidden sm:block", children: "Book your appointment online" })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-4xl sm:text-5xl font-bold text-gray-900 leading-tight", children: "Book Your Appointment Online" }), _jsx("p", { className: "text-xl text-gray-600", children: "Find available times, select your preferred service and staff member, and book your appointment in minutes." }), _jsx("ul", { className: "space-y-3", children: [
                                        'Browse available services and staff',
                                        'Select your preferred date and time',
                                        'Instant confirmation',
                                        'Email reminders before your appointment',
                                    ].map((feature, index) => (_jsxs("li", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "flex items-center justify-center h-6 w-6 rounded-full bg-blue-600", children: _jsx("svg", { className: "h-4 w-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }) }), _jsx("span", { className: "text-gray-700", children: feature })] }, index))) })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl p-8 lg:p-10", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Find Your Business" }), _jsxs("form", { onSubmit: handleBooking, className: "space-y-4", children: [error && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3", children: [_jsx(AlertCircle, { size: 20, className: "text-red-600 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-red-700 text-sm", children: error })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Business Name or Booking Link" }), _jsx("input", { type: "text", value: businessSlug, onChange: (e) => setBusinessSlug(e.target.value), placeholder: "e.g., my-salon or booking-slug", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors text-lg" }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Ask your service provider for their booking link" })] }), _jsx("button", { type: "submit", disabled: loading || !businessSlug.trim(), className: "w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-lg", children: loading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white" }), _jsx("span", { children: "Loading..." })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { children: "Continue" }), _jsx(ArrowRight, { size: 20 })] })) })] }), _jsx("div", { className: "mt-6 p-4 bg-blue-50 rounded-lg", children: _jsxs("p", { className: "text-sm text-gray-700", children: [_jsx("span", { className: "font-semibold", children: "Example:" }), " If your provider gave you", ' ', _jsx("code", { className: "bg-white px-2 py-1 rounded text-blue-600", children: "my-salon" }), ", enter that above."] }) })] })] }) }), _jsx("div", { className: "bg-gray-50 py-16 sm:py-24", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 text-center mb-12", children: "Why Choose Appoint?" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
                                {
                                    icon: '⏰',
                                    title: 'Real-Time Availability',
                                    description: 'See all available appointment slots instantly',
                                },
                                {
                                    icon: '✨',
                                    title: 'Easy Booking',
                                    description: 'Simple, intuitive booking process in just a few clicks',
                                },
                                {
                                    icon: '📧',
                                    title: 'Confirmations & Reminders',
                                    description: 'Get email confirmations and reminders before your appointment',
                                },
                            ].map((feature, index) => (_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow", children: [_jsx("div", { className: "text-4xl mb-4", children: feature.icon }), _jsx("h3", { className: "font-semibold text-lg text-gray-900 mb-2", children: feature.title }), _jsx("p", { className: "text-gray-600", children: feature.description })] }, index))) })] }) }), _jsx("footer", { className: "bg-gray-900 text-gray-300 py-8", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: _jsx("p", { children: "\u00A9 2024 Appoint. Appointment management made simple." }) }) })] }));
};
//# sourceMappingURL=PublicHomePage.js.map