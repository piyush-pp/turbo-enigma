export interface CreateBookingRequest {
  businessSlug: string;
  serviceId: string;
  staffId?: string; // optional for single-staff businesses
  startTimeUtc: string; // ISO 8601 format in UTC
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
}

export interface UpdateBookingRequest {
  status?: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

export interface BookingResponse {
  id: string;
  businessId: string;
  staffId: string;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
  startTime: string; // UTC ISO 8601
  endTime: string; // UTC ISO 8601
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
}

export interface BookingListResponse {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  service: {
    name: string;
    durationMinutes: number;
  };
  staff: {
    name: string;
    email: string;
  };
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
}
