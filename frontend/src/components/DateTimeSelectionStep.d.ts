import { TimeSlot } from '@/hooks/publicApi';
interface DateTimeSelectionStepProps {
    availableSlots: TimeSlot[];
    selectedSlot: TimeSlot | null;
    onSelectSlot: (slot: TimeSlot) => void;
    isLoading?: boolean;
    timezone?: string;
}
export declare const DateTimeSelectionStep: ({ availableSlots, selectedSlot, onSelectSlot, isLoading, timezone, }: DateTimeSelectionStepProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=DateTimeSelectionStep.d.ts.map