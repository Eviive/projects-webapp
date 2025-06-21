import { useState } from "react";

export const useFormState = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    return {
        isSubmitting,
        startSubmitting: () => {
            setIsSubmitting(true);
        },
        endSubmitting: () => {
            setIsSubmitting(false);
        }
    };
};
