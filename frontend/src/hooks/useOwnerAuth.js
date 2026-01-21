import { useState, useCallback } from 'react';
import apiClient from '@/lib/api';
export const useOwnerAuth = () => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('ownerUser');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.post('/owner/auth/login', { email, password });
            const userData = {
                id: response.data.userId,
                email: response.data.email,
                businessId: response.data.businessId,
                businessName: response.data.businessName,
            };
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('ownerUser', JSON.stringify(userData));
            setUser(userData);
            return userData;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const signup = useCallback(async (email, password, businessName) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.post('/owner/auth/register', {
                email,
                password,
                businessName,
            });
            const userData = {
                id: response.data.userId,
                email: response.data.email,
                businessId: response.data.businessId,
                businessName: response.data.businessName,
            };
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('ownerUser', JSON.stringify(userData));
            setUser(userData);
            return userData;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Signup failed';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('ownerUser');
        setUser(null);
    }, []);
    const isAuthenticated = !!user;
    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        signup,
        logout,
    };
};
//# sourceMappingURL=useOwnerAuth.js.map