import type { Project } from "types/entities/project";

export type ProjectLight = Pick<Project, "id" | "title" | "featured" | "sort">;
