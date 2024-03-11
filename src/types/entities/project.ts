import type { Image } from "types/entities/image";
import type { Skill } from "types/entities/skill";

export type Project = {
    id: number;
    title: string;
    descriptionEn: string;
    descriptionFr: string;
    creationDate: string;
    repoUrl: string;
    demoUrl: string;
    featured: boolean;
    sort: number;
    skills: Skill[];
    image: Image;
};
