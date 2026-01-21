import { PublicService, TimeSlot } from '@/hooks/publicApi';
interface BookingReviewStepProps {
    business: {
        name: string;
        timezone: string;
    };
    service: PublicService | null;
    selectedSlot: TimeSlot | null;
    staff?: {
        id: string;
    };
    formData: {
        clientName: string;
        clientEmail: string;
        clientPhone?: string;
        notes?: string;
    };
    isProcessing?: boolean;
}
export declare const BookingReviewStep: ({ business, service, selectedSlot, staff, formData, isProcessing, }: BookingReviewStepProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=BookingReviewStep.d.ts.map