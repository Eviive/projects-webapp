import { request } from "api/client";

import type { Image } from "types/entities/image";

const URL = "image";

const getImageUrl = (image: Image) => image.uuid ? `${import.meta.env.VITE_API_BASE_URL ?? ""}/${URL}/${image.uuid}` : null;

const deleteImage = (id: number) => request<void>(`/${URL}/${id}`, {
    method: "DELETE"
});

export const ImageService = {
    getImageUrl,
    deleteImage
};
