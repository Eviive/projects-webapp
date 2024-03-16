import { z } from "zod";

// Image file
const MAX_IMAGE_SIZE_MB = 3;

const imageFileSchema = z.object({
    file: z.optional(
        z
            .custom<FileList>()
            .refine(
                files => {
                    return [ ...files ?? [] ].every(
                        file => file.size / (1024 * 1024) <= MAX_IMAGE_SIZE_MB
                    );
                },
                `The maximum image size is ${MAX_IMAGE_SIZE_MB}MB`
            )
            .refine(
                files => {
                    return [ ...files ?? [] ].every(file =>
                        file.type.startsWith("image/")
                    );
                },
                "File type is not supported"
            )
    )
});

// Image creation
export const imageCreationSchema = z.object({
    altEn: z
        .string({
            required_error: "English alt is required",
            invalid_type_error: "English alt must be a string"
        })
        .min(1, "English alt is required")
        .max(255, "English alt must be at most 255 characters"),
    altFr: z
        .string({
            required_error: "French alt is required",
            invalid_type_error: "French alt must be a string"
        })
        .min(1, "French alt is required")
        .max(255, "French alt must be at most 255 characters")
});

// Image creation with file
export const imageCreationWithFileSchema = imageCreationSchema.merge(imageFileSchema);

export type ImageCreationWithFile = z.infer<typeof imageCreationWithFileSchema>;

// Image
export const imageSchema = imageCreationWithFileSchema
    .omit({
        file: true
    })
    .extend({
        id: z.number(),
        uuid: z.nullable(z.string())
    });

export type Image = z.infer<typeof imageSchema>;
