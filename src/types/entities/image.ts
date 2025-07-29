import { z } from "zod";

// Image file
const MAX_IMAGE_SIZE_MB = 3;

const imageFileSchema = z.object({
    file: z
        .custom<FileList>()
        .refine(files => {
            return [...files].every(file => file.type.startsWith("image/"));
        }, "File type is not supported")
        .refine(files => {
            return [...files].every(file => file.size / (1024 * 1024) <= MAX_IMAGE_SIZE_MB);
        }, `The maximum image size is ${MAX_IMAGE_SIZE_MB.toString()}MB`)
        .optional()
});

// Image creation
export const imageCreationSchema = z.object({
    altEn: z
        .string({
            error: ({ input }) =>
                input === undefined ? "English alt is required" : "English alt must be a string"
        })
        .min(1, "English alt is required")
        .max(255, "English alt must be at most 255 characters"),
    altFr: z
        .string({
            error: ({ input }) =>
                input === undefined ? "French alt is required" : "French alt must be a string"
        })
        .min(1, "French alt is required")
        .max(255, "French alt must be at most 255 characters")
});

// Image creation with file
export const imageCreationWithFileSchema = z.object({
    ...imageCreationSchema.shape,
    ...imageFileSchema.shape
});

export type ImageCreationWithFile = z.infer<typeof imageCreationWithFileSchema>;

// Image
export const imageSchema = z.object({
    ...imageCreationWithFileSchema.omit({ file: true }).shape,
    id: z.number(),
    uuid: z.uuid().optional()
});

export type Image = z.infer<typeof imageSchema>;
