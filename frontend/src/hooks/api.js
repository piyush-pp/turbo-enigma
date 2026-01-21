import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
export const useBookings = (businessId, filters) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({ businessId, ...filters });
                const response = await apiClient.get(`/bookings?${params}`);
                setBookings(response.data);
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
            }
            finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [businessId, filters]);
    const updateBooking = async (bookingId, status) => {
        try {
            await apiClient.patch(`/bookings/${bookingId}`, { status, businessId });
            setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: status } : b)));
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : 'Failed to update booking');
        }
    };
    return { bookings, loading, error, updateBooking };
};
export const useServices = (businessId) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/owner/services/${businessId}`);
                setServices(response.data);
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch services');
            }
            finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [businessId]);
    return { services, loading, error };
};
export const useStaff = (businessId) => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/owner/staff/${businessId}`);
                setStaff(response.data);
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch staff');
            }
            finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [businessId]);
    return { staff, loading, error };
};
export const useBusiness = (businessId) => {
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/owner/business`);
                const b = response.data.find((b) => b.id === businessId);
                setBusiness(b);
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch business');
            }
            finally {
                setLoading(false);
            }
        };
        fetchBusiness();
    }, [businessId]);
    return { business, loading, error };
};
//# sourceMappingURL=api.js.map