export interface CreateServiceRequest {
  name: string;
  description?: string;
  durationMinutes: number; // in minutes (required)
  price?: number;
  currency?: string;
  imageUrl?: string;
  staffIds?: string[]; // optional initial staff assignment
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  durationMinutes?: number; // can update duration
  staffIds?: string[]; // update assigned staff
}

export interface ServiceResponse {
  id: string;
  businessId: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price?: number | null;
  currency: string;
  imageUrl?: string | null;
  isActive: boolean;
  isPluginEnabled: boolean;
  staff?: Array<{
    id: string;
    userId: string;
    email: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceListResponse {
  id: string;
  businessId: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price?: number | null;
  currency: string;
  imageUrl?: string | null;
  isActive: boolean;
  staffCount: number;
  createdAt: string;
}

export interface PublicServiceResponse {
  id: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price?: number | null;
  currency: string;
  imageUrl?: string | null;
}
