import {
    imageCreationSchema,
    imageCreationWithFileSchema,
    imageSchema
} from "types/entities/image";
import { z } from "zod";

// Skill creation
export const skillCreationSchema = z.object({
    name: z
        .string({
            error: ({ input }) =>
                input === undefined ? "Name is required" : "Name must be a string"
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
    sort: z.number({
        error: ({ input }) => (input === undefined ? "Sort is required" : "Sort must be a string")
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
