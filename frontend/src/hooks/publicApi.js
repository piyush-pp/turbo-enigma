import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
console.log('API_BASE_URL:', API_BASE_URL);
const publicApiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Public APIs (no auth required)
export const getBusinessBySlug = async (slug) => {
    const response = await publicApiClient.get(`/owner/business/public/${slug}`);
    return response.data;
};
export const getServices = async (businessId) => {
    const response = await publicApiClient.get(`/owner/services/public/${businessId}`);
    return response.data;
};
export const getStaff = async (businessId) => {
    const response = await publicApiClient.get(`/owner/staff/public/${businessId}`);
    return response.data.filter((s) => s.isActive);
};
export const getAvailableSlots = async (businessSlug, serviceId, date, staffId, timezone) => {
    const params = {
        businessSlug,
        serviceId,
        date,
    };
    if (staffId)
        params.staffId = staffId;
    if (timezone)
        params.timezone = timezone;
    const response = await publicApiClient.get('/public/slots', { params });
    return response.data;
};
export const createBooking = async (booking) => {
    const response = await publicApiClient.post('/bookings', booking);
    return response.data;
};
export default publicApiClient;
//# sourceMappingURL=publicApi.js.map