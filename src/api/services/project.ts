import { request } from "api/client";
import type { Page } from "types/app";

import type { Project } from "types/entities/project";
import type { Skill } from "types/entities/skill";

const URL = "project";

const findById = (id: number) => request<Project>(`/${URL}/${id}`, { needsAuth: false });

const findAll = () => request<Project[]>(`/${URL}`, { needsAuth: false });

const findAllFeatured = () => request<Project[]>(`/${URL}/featured`, { needsAuth: false });

const findAllNotFeatured = () => request<Project[]>(`/${URL}/not-featured`, { needsAuth: false });

const findAllNotFeaturedPaginated = (page?: number, size?: number) => request<Page<Project>>(`/${URL}/not-featured/paginated`, { params: { page, size }, needsAuth: false });

const save = (project: Project, file?: File | null) => {
    if (!file) {
        return request<Project, Project>(`/${URL}`, {
            method: "POST",
            data: project
        });
    }

    return request<Project, FormData>(`/${URL}/with-image`, {
        method: "POST",
        data: buildFormData(project, file),
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

const sort = (sortedIds: number[]) => {
    return request<void, number[]>(`/${URL}/sort`, {
        method: "POST",
        data: sortedIds
    });
};

const update = (project: Project, file?: File | null) => {
    if (!file) {
        return request<Project, Project>(`/${URL}/${project.id}`, {
            method: "PUT",
            data: project
        });
    }

    return request<Skill, FormData>(`/${URL}/${project.id}/with-image`, {
        method: "PUT",
        data: buildFormData(project, file),
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

const deleteProject = (id: number) => request<void>(`/${URL}/${id}`, {
    method: "DELETE"
});

const buildFormData = (project: Project, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("project", new Blob([ JSON.stringify(project) ], { type: "application/json" }));
    return formData;
};

export const ProjectService = {
    findById,
    findAll,
    findAllFeatured,
    findAllNotFeatured,
    findAllNotFeaturedPaginated,
    save,
    sort,
    update,
    delete: deleteProject
};
