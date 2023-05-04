import { request } from "api/client";
import { Page, Project } from "types/entities";

const URL = "project";

const findById = (id: number) => request<Project>(`/${URL}/${id}`, {}, false);

const findAll = () => request<Project[]>(`/${URL}`, {}, false);

const findAllFeatured = () => request<Project[]>(`/${URL}/featured`, {}, false);

const findAllNotFeatured = () => request<Project[]>(`/${URL}/not-featured`, {}, false);

const findAllNotFeaturedPaginated = (page: number) => request<Page<Project[]>>(`/${URL}/not-featured/paginated`, { params: { page } }, false);

const save = (project: Project) => request<Project, Project>(`/${URL}`, {
    method: "POST",
    data: project
});

const update = (project: Project) => request<Project, Project>(`/${URL}/${project.id}`, {
    method: "PUT",
    data: project
});

const deleteProject = (id: number) => request<void>(`/${URL}/${id}`, {
    method: "DELETE"
});

const uploadImage = (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<Project, FormData>(`/${URL}/${id}/upload-image`, {
        method: "POST",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const ProjectService = {
    findById,
    findAll,
    findAllFeatured,
    findAllNotFeatured,
    findAllNotFeaturedPaginated,
    save,
    update,
    delete: deleteProject,
    uploadImage
};
