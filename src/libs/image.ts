import type { Image } from "types/entities/image";

export const getImageUrl = (image: Image, type: "skills" | "projects") => {
    if (!image.uuid) return null;

    return `${import.meta.env.VITE_AZURE_ASSETS_BASE_URL}/${type}/${image.uuid}`;
};
