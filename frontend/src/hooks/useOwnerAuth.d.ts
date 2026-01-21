export interface AuthUser {
    id: string;
    email: string;
    businessId: string;
    businessName: string;
}
export declare const useOwnerAuth: () => {
    user: AuthUser;
    isAuthenticated: boolean;
    loading: boolean;
    error: string;
    login: (email: string, password: string) => Promise<AuthUser>;
    signup: (email: string, password: string, businessName: string) => Promise<AuthUser>;
    logout: () => void;
};
//# sourceMappingURL=useOwnerAuth.d.ts.map