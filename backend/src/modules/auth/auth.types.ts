export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  businessName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
  name: string;
  role: string;
  businessId: string;
  accessToken: string;
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}
