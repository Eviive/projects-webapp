import type { Dispatch } from "react";
import { useReducer } from "react";

type SubmissionActionType = "edition" | "deletion";
type SubmissionActionState = "started" | "finished";
type AvailableSubmissionActions = `${SubmissionActionType}${Capitalize<SubmissionActionState>}`;

type SubmissionStateKey = `isSubmitting${Capitalize<SubmissionActionType>}`;
type SubmissionState = { [key in SubmissionStateKey]: boolean };

type UseFormSubmissionStateOutput = [ SubmissionState, Dispatch<AvailableSubmissionActions> ];

export const useFormSubmissionState = (): UseFormSubmissionStateOutput => {
    const reducer = (state: SubmissionState, action: AvailableSubmissionActions): SubmissionState => {
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
