import apiClient from '@/lib/api';
// Business Management
export const getBusiness = async (businessId) => {
    const response = await apiClient.get(`/owner/business/${businessId}`);
    return response.data;
};
export const updateBusiness = async (businessId, data) => {
    const response = await apiClient.put(`/owner/business/${businessId}`, data);
    return response.data;
};
// Staff Management
export const getStaffList = async (businessId) => {
    const response = await apiClient.get(`/owner/staff/${businessId}`);
    return response.data;
};
export const createStaff = async (businessId, data) => {
    const response = await apiClient.post(`/owner/staff`, {
        businessId,
        ...data,
    });
    return response.data;
};
export const updateStaff = async (staffId, data) => {
    const response = await apiClient.put(`/owner/staff/${staffId}`, data);
    return response.data;
};
export const deleteStaff = async (staffId) => {
    await apiClient.delete(`/owner/staff/${staffId}`);
};
// Service Management
export const getServices = async (businessId) => {
    const response = await apiClient.get(`/owner/services/${businessId}`);
    return response.data;
};
export const createService = async (businessId, data) => {
    const response = await apiClient.post(`/owner/services`, {
        businessId,
        ...data,
    });
    return response.data;
};
export const updateService = async (serviceId, data) => {
    const response = await apiClient.put(`/owner/services/${serviceId}`, data);
    return response.data;
};
export const deleteService = async (serviceId) => {
    await apiClient.delete(`/owner/services/${serviceId}`);
};
// Bookings
export const getBookings = async (businessId) => {
    const response = await apiClient.get(`/owner/bookings/${businessId}`);
    return response.data;
};
export const updateBookingStatus = async (bookingId, status) => {
    const response = await apiClient.patch(`/owner/bookings/${bookingId}`, { status });
    return response.data;
};
// Availability Management
export const getAvailabilityRules = async (staffId) => {
    const response = await apiClient.get(`/owner/availability/${staffId}`);
    return response.data;
};
export const updateAvailabilityRules = async (staffId, rules) => {
    const response = await apiClient.put(`/owner/availability/${staffId}`, rules);
    return response.data;
};
//# sourceMappingURL=useOwnerApi.js.map