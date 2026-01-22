export interface CreateStaffRequest {
  userId: string;
  businessId: string;
}

export interface UpdateStaffRequest {
  isActive?: boolean;
}

export interface StaffResponse {
  id: string;
  userId: string;
  businessId: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffListResponse {
  id: string;
  userId: string;
  email: string;
  name: string;
  businessId: string;
  isActive: boolean;
  createdAt: string;
}
