import { PublicService, PublicStaff } from '@/hooks/publicApi';
interface ServiceSelectionStepProps {
    services: PublicService[];
    selectedServiceId: string | null;
    onSelectService: (serviceId: string) => void;
    isLoading?: boolean;
}
export declare const ServiceSelectionStep: ({ services, selectedServiceId, onSelectService, isLoading, }: ServiceSelectionStepProps) => import("react/jsx-runtime").JSX.Element;
interface StaffSelectionStepProps {
    staff: PublicStaff[];
    selectedStaffId: string | null;
    onSelectStaff: (staffId: string) => void;
    isSingleStaff: boolean;
    isLoading?: boolean;
}
export declare const StaffSelectionStep: ({ staff, selectedStaffId, onSelectStaff, isSingleStaff, isLoading, }: StaffSelectionStepProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=BookingSteps.d.ts.map