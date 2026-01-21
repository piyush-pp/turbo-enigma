interface Step {
    id: number;
    title: string;
    description: string;
}
interface WizardProps {
    steps: Step[];
    currentStep: number;
    onNext: () => void;
    onPrev: () => void;
    children: React.ReactNode;
    isLoading?: boolean;
    canContinue?: boolean;
}
export declare const BookingWizard: ({ steps, currentStep, onNext, onPrev, children, isLoading, canContinue, }: WizardProps) => import("react/jsx-runtime").JSX.Element;
export default BookingWizard;
//# sourceMappingURL=BookingWizard.d.ts.map