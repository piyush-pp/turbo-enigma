interface CustomerInfoStepProps {
    formData: {
        clientName: string;
        clientEmail: string;
        clientPhone?: string;
        notes?: string;
    };
    onChange: (field: string, value: string) => void;
    errors?: Record<string, string>;
}
export declare const CustomerInfoStep: ({ formData, onChange, errors, }: CustomerInfoStepProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CustomerInfoStep.d.ts.map