import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import BookingWizard from '@/components/BookingWizard';
import { ServiceSelectionStep, StaffSelectionStep } from '@/components/BookingSteps';
import { DateTimeSelectionStep } from '@/components/DateTimeSelectionStep';
import { CustomerInfoStep } from '@/components/CustomerInfoStep';
import { BookingReviewStep } from '@/components/BookingReviewStep';
import { getBusinessBySlug, getServices, getStaff, getAvailableSlots, createBooking, } from '@/hooks/publicApi';
import { AlertCircle, CheckCircle, Home } from 'lucide-react';
export const PublicBookingPage = () => {
    const { businessSlug } = useParams();
    const navigate = useNavigate();
    // State management
    const [currentStep, setCurrentStep] = useState(0);
    const [business, setBusiness] = useState(null);
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    // Form selections
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        notes: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Steps definition
    const steps = [
        { id: 1, title: 'Select Service', description: 'Choose a service' },
        ...(business && !business.isSingleStaff
            ? [
                {
                    id: 2,
                    title: 'Select Staff',
                    description: 'Choose your preferred staff member',
                },
            ]
            : []),
        { id: 3, title: 'Choose Date & Time', description: 'Select your preferred appointment time' },
        { id: 4, title: 'Your Information', description: 'Provide your contact details' },
        { id: 5, title: 'Review & Confirm', description: 'Review and confirm your booking' },
    ];
    // Initial load
    useEffect(() => {
        const loadBusiness = async () => {
            try {
                setLoading(true);
                const businessData = await getBusinessBySlug(businessSlug);
                setBusiness(businessData);
                const servicesData = await getServices(businessData.id);
                setServices(servicesData);
                const staffData = await getStaff(businessData.id);
                setStaff(staffData);
                // Auto-select staff if single-staff mode
                if (businessData.isSingleStaff && staffData.length > 0) {
                    setSelectedStaffId(staffData[0].id);
                }
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load business');
            }
            finally {
                setLoading(false);
            }
        };
        loadBusiness();
    }, [businessSlug]);
    // Load available slots when service and date change
    useEffect(() => {
        if (!selectedServiceId || !business)
            return;
        const loadSlots = async () => {
            try {
                setLoading(true);
                const slots = await getAvailableSlots(businessSlug, selectedServiceId, format(new Date(), 'yyyy-MM-dd'), selectedStaffId || undefined, business.timezone);
                setAvailableSlots(slots);
            }
            catch (err) {
                console.error('Failed to load slots:', err);
            }
            finally {
                setLoading(false);
            }
        };
        loadSlots();
    }, [selectedServiceId, selectedStaffId]);
    // Get selected service
    const selectedService = Array.isArray(services) ? services.find((s) => s.id === selectedServiceId) : undefined;
    // Determine current step based on actual data
    const getActualCurrentStep = () => {
        if (!selectedServiceId)
            return 0;
        if (!business?.isSingleStaff && !selectedStaffId)
            return 1;
        if (!selectedSlot)
            return business?.isSingleStaff ? 1 : 2;
        if (!formData.clientName || !formData.clientEmail)
            return business?.isSingleStaff ? 2 : 3;
        return business?.isSingleStaff ? 3 : 4;
    };
    const handleNext = async () => {
        const actualStep = getActualCurrentStep();
        // Validation for last step (review)
        if (actualStep === steps.length - 1) {
            await handleBooking();
            return;
        }
        // Move to next step
        if (actualStep < steps.length - 1) {
            setCurrentStep(actualStep + 1);
        }
    };
    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    const validateForm = () => {
        const errors = {};
        if (!formData.clientName.trim()) {
            errors.clientName = 'Name is required';
        }
        if (!formData.clientEmail.trim()) {
            errors.clientEmail = 'Email is required';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
            errors.clientEmail = 'Invalid email format';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleBooking = async () => {
        if (!validateForm())
            return;
        if (!selectedService || !selectedSlot || !business)
            return;
        setIsSubmitting(true);
        try {
            const response = await createBooking({
                businessSlug,
                serviceId: selectedServiceId,
                staffId: selectedStaffId,
                startTimeUtc: selectedSlot.startTimeUtc,
                clientName: formData.clientName,
                clientEmail: formData.clientEmail,
                clientPhone: formData.clientPhone,
                notes: formData.notes,
            });
            setBookingSuccess(true);
            setBookingId(response.id);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create booking');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleFormChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };
    // Loading state
    if (loading && !business) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Loading booking page..." })] }) }));
    }
    // Error state
    if (error && !business) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center", children: [_jsx(AlertCircle, { size: 48, className: "text-red-600 mx-auto mb-4" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Error" }), _jsx("p", { className: "text-gray-600 mb-6", children: error }), _jsxs("button", { onClick: () => navigate('/'), className: "inline-flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: [_jsx(Home, { size: 20 }), _jsx("span", { children: "Go Home" })] })] }) }));
    }
    // Success state
    if (bookingSuccess) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center", children: [_jsx(CheckCircle, { size: 64, className: "text-green-600 mx-auto mb-4" }), _jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Booking Confirmed!" }), _jsxs("p", { className: "text-gray-600 mb-6", children: ["Your appointment has been successfully booked. A confirmation email has been sent to", ' ', _jsx("span", { className: "font-semibold", children: formData.clientEmail }), "."] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg mb-6 text-left", children: [_jsxs("p", { className: "text-sm text-gray-600 mb-2", children: [_jsx("span", { className: "font-semibold", children: "Confirmation #:" }), " ", bookingId] }), _jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-semibold", children: "Service:" }), " ", selectedService?.name] }), selectedSlot && (_jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-semibold", children: "Time:" }), ' ', format(new Date(selectedSlot.startTimeUtc), 'MMM d, yyyy HH:mm')] }))] }), _jsx("button", { onClick: () => navigate('/'), className: "w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Back to Home" })] }) }));
    }
    // Main booking wizard
    if (!business) {
        return null;
    }
    const actualStep = getActualCurrentStep();
    return (_jsxs(BookingWizard, { steps: steps, currentStep: actualStep, onNext: handleNext, onPrev: handlePrev, isLoading: isSubmitting || loading, canContinue: actualStep === 0
            ? !!selectedServiceId
            : actualStep === 1 && !business.isSingleStaff
                ? !!selectedStaffId
                : actualStep === (business.isSingleStaff ? 1 : 2)
                    ? !!selectedSlot
                    : actualStep === (business.isSingleStaff ? 2 : 3)
                        ? !!formData.clientName && !!formData.clientEmail
                        : true, children: [error && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3", children: [_jsx(AlertCircle, { size: 20, className: "text-red-600 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-red-700", children: error })] })), actualStep === 0 && (_jsx(ServiceSelectionStep, { services: services, selectedServiceId: selectedServiceId, onSelectService: setSelectedServiceId, isLoading: loading })), !business.isSingleStaff && actualStep === 1 && (_jsx(StaffSelectionStep, { staff: staff, selectedStaffId: selectedStaffId, onSelectStaff: setSelectedStaffId, isSingleStaff: false, isLoading: loading })), actualStep === (business.isSingleStaff ? 1 : 2) && (_jsx(DateTimeSelectionStep, { availableSlots: availableSlots, selectedSlot: selectedSlot, onSelectSlot: setSelectedSlot, isLoading: loading, timezone: business.timezone })), actualStep === (business.isSingleStaff ? 2 : 3) && (_jsx(CustomerInfoStep, { formData: formData, onChange: handleFormChange, errors: formErrors })), actualStep === steps.length - 1 && (_jsx(BookingReviewStep, { business: business, service: selectedService || null, selectedSlot: selectedSlot, staff: Array.isArray(staff) ? staff.find((s) => s.id === selectedStaffId) : undefined, formData: formData, isProcessing: isSubmitting }))] }));
};
//# sourceMappingURL=PublicBookingPage.js.map