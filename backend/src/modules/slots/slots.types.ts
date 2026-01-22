export interface GetSlotsRequest {
  businessSlug: string;
  serviceId: string;
  staffId?: string; // optional for single-staff businesses
  date: string; // YYYY-MM-DD format
  timezone?: string; // defaults to business timezone
}

export interface TimeSlot {
  startTime: string; // ISO 8601 format (local time for display)
  endTime: string; // ISO 8601 format (local time for display)
  startTimeUtc: string; // ISO 8601 in UTC
  endTimeUtc: string; // ISO 8601 in UTC
  available: boolean;
}

export interface SlotsResponse {
  businessSlug: string;
  serviceId: string;
  staffId: string;
  date: string;
  timezone: string;
  serviceDuration: number; // in minutes
  slots: TimeSlot[];
  totalSlots: number;
  availableSlots: number;
}
