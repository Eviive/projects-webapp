import { imageCreationSchema, imageCreationWithFileSchema, imageSchema } from "types/entities/image";
import { z } from "zod";

// Skill creation
export const skillCreationSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string"
        })
        .min(1, "Name is required")
        .max(50, "Name must be at most 50 characters"),
    image: imageCreationSchema
});

export type SkillCreation = z.infer<typeof skillCreationSchema>;

// Skill creation with file
export const skillCreationWithFileSchema = skillCreationSchema.extend({
    image: imageCreationWithFileSchema
});

export type SkillCreationWithFile = z.infer<typeof skillCreationWithFileSchema>;

// Skill
export const skillSchema = skillCreationSchema.extend({
    id: z.number(),
    sort: z
        .number({
            required_error: "Sort is required",
            invalid_type_error: "Sort must be a number"
        }),
    image: imageSchema
});

export type Skill = z.infer<typeof skillSchema>;

// Skill edition with file
export const skillEditionWithFileSchema = skillSchema.and(
    z.object({
        image: imageCreationWithFileSchema
    })
);

export type SkillEditionWithFile = z.infer<typeof skillEditionWithFileSchema>;
