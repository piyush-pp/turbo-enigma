declare const publicApiClient: import("axios").AxiosInstance;
export interface PublicBusiness {
    id: string;
    name: string;
    slug: string;
    description?: string;
    timezone: string;
    isSingleStaff: boolean;
}
export interface PublicService {
    id: string;
    name: string;
    description?: string;
    duration: number;
    price: number;
    isActive: boolean;
}
export interface PublicStaff {
    id: string;
    userId: string;
    businessId: string;
    isActive: boolean;
}
export interface TimeSlot {
    startTimeUtc: string;
    endTimeUtc: string;
}
export interface BookingRequest {
    businessSlug: string;
    serviceId: string;
    staffId?: string;
    startTimeUtc: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    notes?: string;
}
export interface BookingResponse {
    id: string;
    status: string;
    startTimeUtc: string;
    endTimeUtc: string;
    clientName: string;
    clientEmail: string;
}
export declare const getBusinessBySlug: (slug: string) => Promise<PublicBusiness>;
export declare const getServices: (businessId: string) => Promise<PublicService[]>;
export declare const getStaff: (businessId: string) => Promise<PublicStaff[]>;
export declare const getAvailableSlots: (businessSlug: string, serviceId: string, date: string, staffId?: string, timezone?: string) => Promise<TimeSlot[]>;
export declare const createBooking: (booking: BookingRequest) => Promise<BookingResponse>;
export default publicApiClient;
//# sourceMappingURL=publicApi.d.ts.map