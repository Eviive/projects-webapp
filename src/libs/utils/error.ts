import { AxiosError } from "axios";
import z from "zod";

const problemDetailSchema = z.object({
    title: z
        .string({
            required_error: "Title is required",
            invalid_type_error: "Title must be a string"
        })
        .min(1, "Title is required"),
    detail: z
        .string({
            required_error: "Detail is required",
            invalid_type_error: "Detail must be a string"
        })
        .min(1, "Detail is required")
});

type TitleAndDetail = z.infer<typeof problemDetailSchema>;

export const getTitleAndDetail = (e: unknown): TitleAndDetail => {
    if (!import.meta.env.PROD) {
        console.error(e);
    }

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
