export interface Owner {
    id: string;
    email: string;
    businessId: string;
}
export interface Business {
    id: string;
    name: string;
    description: string;
    slug: string;
    timezone: string;
    isSingleStaff: boolean;
    email?: string;
    phone?: string;
}
export interface Staff {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    isActive: boolean;
}
export interface Service {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    isActive: boolean;
}
export interface Booking {
    id: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    serviceName: string;
    staffName: string;
    startTimeUtc: string;
    endTimeUtc: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes?: string;
}
export declare const getBusiness: (businessId: string) => Promise<Business>;
export declare const updateBusiness: (businessId: string, data: Partial<Business>) => Promise<Business>;
export declare const getStaffList: (businessId: string) => Promise<Staff[]>;
export declare const createStaff: (businessId: string, data: Omit<Staff, "id" | "isActive">) => Promise<Staff>;
export declare const updateStaff: (staffId: string, data: Partial<Staff>) => Promise<Staff>;
export declare const deleteStaff: (staffId: string) => Promise<void>;
export declare const getServices: (businessId: string) => Promise<Service[]>;
export declare const createService: (businessId: string, data: Omit<Service, "id" | "isActive">) => Promise<Service>;
export declare const updateService: (serviceId: string, data: Partial<Service>) => Promise<Service>;
export declare const deleteService: (serviceId: string) => Promise<void>;
export declare const getBookings: (businessId: string) => Promise<Booking[]>;
export declare const updateBookingStatus: (bookingId: string, status: "confirmed" | "completed" | "cancelled") => Promise<Booking>;
export declare const getAvailabilityRules: (staffId: string) => Promise<any>;
export declare const updateAvailabilityRules: (staffId: string, rules: any) => Promise<any>;
//# sourceMappingURL=useOwnerApi.d.ts.map