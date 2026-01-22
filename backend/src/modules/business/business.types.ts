export interface CreateBusinessRequest {
  name: string;
  description?: string;
  slug: string;
  timezone?: string;
  isSingleStaff?: boolean;
}

export interface UpdateBusinessRequest {
  name?: string;
  description?: string;
  timezone?: string;
  isSingleStaff?: boolean;
}

export interface BusinessResponse {
  id: string;
  name: string;
  description?: string;
  slug: string;
  timezone: string;
  isSingleStaff: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
