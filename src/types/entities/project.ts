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
            error: ({ input }) =>
                input === undefined ? "Title is required" : "Title must be a string"
        })
        .min(1, "Title is required")
        .max(50, "Title must be at most 50 characters"),
    descriptionEn: z
        .string({
            error: ({ input }) =>
                input === undefined
                    ? "Description (English) is required"
                    : "Description (English) must be a string"
        })
        .min(1, "Description (English) is required")
        .max(510, "Description (English) must be at most 500 characters"),
    descriptionFr: z
        .string({
            error: ({ input }) =>
                input === undefined
                    ? "Description (French) is required"
                    : "Description (French) must be a string"
        })
        .min(1, "Description (French) is required")
        .max(510, "Description (French) must be at most 500 characters"),
    creationDate: z.date({
        error: ({ input }) =>
            input === undefined ? "Creation date is required" : "Creation date must be a valid date"
    }),
    repoUrl: z
        .url({
            error: ({ input }) =>
                input === undefined
                    ? "Repository URL is required"
                    : "Repository URL must be a valid URL"
        })
        .max(255, "Repository URL must be at most 255 characters"),
    demoUrl: z
        .url({
            error: ({ input }) =>
                input === undefined
                    ? "Demonstration URL is required"
                    : "Demonstration URL must be a valid URL"
        })
        .max(255, "Demonstration URL must be at most 255 characters"),
    featured: z.boolean({
        error: ({ input }) =>
            input === undefined ? "Featured is required" : "Featured must be a string"
    }),
    skills: z.array(skillSchema).min(1, "At least one skill is required"),
    image: imageCreationSchema
});

export type ProjectCreation = z.infer<typeof projectCreationSchema>;

// Project creation with file
export const projectCreationWithFileSchema = z.object({
    ...projectCreationSchema.shape,
    image: imageCreationWithFileSchema
});

export type ProjectCreationWithFile = z.infer<typeof projectCreationWithFileSchema>;

// Project
export const projectSchema = z.object({
    ...projectCreationSchema.shape,
    id: z.number(),
    sort: z.number({
        error: ({ input }) => (input === undefined ? "Sort is required" : "Sort must be a string")
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
