import {
    imageCreationSchema,
    imageCreationWithFileSchema,
    imageSchema
} from "types/entities/image";
import { skillSchema } from "types/entities/skill";
import { z } from "zod";

// Project creation
export const projectCreationSchema = z.object({
    title: z
        .string({
            required_error: "Title is required",
            invalid_type_error: "Title must be a string"
        })
        .min(1, "Title is required")
        .max(50, "Title must be at most 50 characters"),
    descriptionEn: z
        .string({
            required_error: "Description (English) is required",
            invalid_type_error: "Description (English) must be a string"
        })
        .min(1, "Description (English) is required")
        .max(510, "Description (English) must be at most 500 characters"),
    descriptionFr: z
        .string({
            required_error: "Description (French) is required",
            invalid_type_error: "Description (French) must be a string"
        })
        .min(1, "Description (French) is required")
        .max(510, "Description (French) must be at most 500 characters"),
    creationDate: z
        .string({
            required_error: "Creation date is required"
        })
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Creation date must be in the format YYYY-MM-DD"
        })
        .refine(value => !isNaN(Date.parse(value)), {
            message: "Creation date must be a date"
        }),
    repoUrl: z
        .string({
            required_error: "Repository URL is required",
            invalid_type_error: "Repository URL must be a string"
        })
        .url("Repository URL must be a valid URL")
        .max(255, "Repository URL must be at most 255 characters"),
    demoUrl: z
        .string({
            required_error: "Demonstration URL is required",
            invalid_type_error: "Demonstration URL must be a string"
        })
        .url("Demonstration URL must be a valid URL")
        .max(255, "Demonstration URL must be at most 255 characters"),
    featured: z.boolean({
        required_error: "Featured is required",
        invalid_type_error: "Featured must be a boolean"
    }),
    skills: z.array(skillSchema).min(1, "At least one skill is required"),
    image: imageCreationSchema
});

export type ProjectCreation = z.infer<typeof projectCreationSchema>;

// Project creation with file
export const projectCreationWithFileSchema = projectCreationSchema.extend({
    image: imageCreationWithFileSchema
});

export type ProjectCreationWithFile = z.infer<typeof projectCreationWithFileSchema>;

// Project
export const projectSchema = projectCreationSchema.extend({
    id: z.number(),
    sort: z.number({
        required_error: "Sort is required",
        invalid_type_error: "Sort must be a number"
    }),
    image: imageSchema
});

export type Project = z.infer<typeof projectSchema>;

// Project edition with file
export const projectEditionWithFileSchema = projectSchema.and(
    z.object({
        image: imageCreationWithFileSchema
    })
);

export type ProjectEditionWithFile = z.infer<typeof projectEditionWithFileSchema>;
