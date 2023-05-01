import { request } from "api/client";
import { Image } from "types/entities";

const URL = "image";

const getImageUrl = (image: Image) => `${import.meta.env.VITE_API_BASE_URL}/${URL}/${image.id}`;

const deleteImage = (id: number) => request<void>(`/${URL}/${id}`, {
    method: "DELETE"
});

export const ImageService = {
    getImageUrl,
    deleteImage
};
