import { z } from "zod";

export const problemDetailSchema = z.object({
    title: z
        .string({
            error: ({ input }) =>
                input === undefined ? "Title is required" : "Title must be a string"
        })
        .min(1, "Title is required"),
    detail: z
        .string({
            error: ({ input }) =>
                input === undefined ? "Detail is required" : "Detail must be a string"
        })
        .min(1, "Detail is required")
});

export type TitleAndDetail = z.infer<typeof problemDetailSchema>;
