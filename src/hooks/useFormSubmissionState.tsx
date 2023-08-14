import type { Dispatch } from "react";
import { useReducer } from "react";

type SubmissionAction = "edition" | "deletion";
type SubmissionActionStarted = `${SubmissionAction}Started`;
type SubmissionActionFinished = `${SubmissionAction}Finished`;
type AvailableSubmissionActions = SubmissionActionStarted | SubmissionActionFinished;

type SubmissionStateKey = `isSubmitting${Capitalize<SubmissionAction>}`;
type SubmissionState = { [key in SubmissionStateKey]: boolean };

export const useFormSubmissionState = (): [ SubmissionState, Dispatch<AvailableSubmissionActions> ] => {
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
