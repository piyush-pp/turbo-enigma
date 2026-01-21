import { Booking } from '@/hooks/api';
interface AppointmentCardProps {
    booking: Booking;
    onStatusChange?: (bookingId: string, status: string) => void;
}
export declare const AppointmentCard: ({ booking, onStatusChange }: AppointmentCardProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AppointmentCard.d.ts.map