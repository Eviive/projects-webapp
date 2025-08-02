import { AxiosError } from "axios";
import type { TitleAndDetail } from "types/error";
import { problemDetailSchema } from "types/error";

export const getTitleAndDetail = (e: unknown): TitleAndDetail => {
    if (e instanceof AxiosError && e.response !== undefined) {
        const dataParseResult = problemDetailSchema.safeParse(e.response.data);

        if (dataParseResult.success) {
            return dataParseResult.data;
        }
    }

    if (e instanceof Error) {
        return {
            title: e.name,
            detail: e.message
        };
    }

    return {
        title: "Unknown error",
        detail: "Please contact an administrator if this error persists."
    };
};

export const getDetail = (e: unknown): TitleAndDetail["detail"] => {
    return getTitleAndDetail(e).detail;
};
