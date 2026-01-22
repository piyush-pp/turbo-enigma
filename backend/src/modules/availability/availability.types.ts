export interface AvailabilityRuleInput {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isWorkingDay?: boolean; // true if working, false if day off
}

export interface SetAvailabilityRequest {
  rules: AvailabilityRuleInput[]; // All days 0-6, or subset with defaults
}

export interface AvailabilityRuleResponse {
  id: string;
  dayOfWeek: number;
  dayName: string;
  startTime: string;
  endTime: string;
  isWorkingDay: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityResponse {
  staffId: string;
  businessId: string;
  rules: AvailabilityRuleResponse[];
}

// Day name helper
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
