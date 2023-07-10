import { useReducer } from "react";

type SubmissionState = {
    isSubmittingEdition: boolean;
    isSubmittingDeletion: boolean;
};

type SubmissionAction = "edition" | "deletion";
type SubmissionActionStarted = `${SubmissionAction}Started`;
type SubmissionActionFinished = `${SubmissionAction}Finished`;

export const useFormSubmissionState = () => {
    const reducer = (state: SubmissionState, action: SubmissionActionStarted | SubmissionActionFinished) => {
        switch (action) {
            case "editionStarted":
                return { ...state, isSubmittingEdition: true };
            case "editionFinished":
                return { ...state, isSubmittingEdition: false };
            case "deletionStarted":
                return { ...state, isSubmittingDeletion: true };
            case "deletionFinished":
                return { ...state, isSubmittingDeletion: false };
        }
    };

    return useReducer(reducer, {
        isSubmittingEdition: false,
        isSubmittingDeletion: false
    });
};
