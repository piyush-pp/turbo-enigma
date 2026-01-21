export interface Booking {
    id: string;
    serviceId: string;
    staffId: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    notes?: string;
    startTimeUtc: string;
    endTimeUtc: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    createdAt: string;
}
export interface Service {
    id: string;
    name: string;
    description?: string;
    duration: number;
    price: number;
    isActive: boolean;
}
export interface Staff {
    id: string;
    userId: string;
    businessId: string;
    isActive: boolean;
}
export interface Customer {
    id: string;
    email: string;
    name: string;
    bookingsCount: number;
    totalSpent: number;
}
export interface Business {
    id: string;
    name: string;
    slug: string;
    timezone: string;
    isSingleStaff: boolean;
}
export declare const useBookings: (businessId: string, filters?: Record<string, string>) => {
    bookings: Booking[];
    loading: boolean;
    error: string;
    updateBooking: (bookingId: string, status: string) => Promise<void>;
};
export declare const useServices: (businessId: string) => {
    services: Service[];
    loading: boolean;
    error: string;
};
export declare const useStaff: (businessId: string) => {
    staff: Staff[];
    loading: boolean;
    error: string;
};
export declare const useBusiness: (businessId: string) => {
    business: Business;
    loading: boolean;
    error: string;
};
//# sourceMappingURL=api.d.ts.map