import { request } from "api/client";
import { buildFormData } from "libs/utils/form-data";
import type { DndItem } from "types/dnd";
import type { Project, ProjectCreation } from "types/entities/project";
import type { ProjectLight } from "types/entities/project-light";
import type { Page } from "types/pagination";

const URL = "project";

export const PROJECTS_PAGE_SIZE_OPTIONS = [6, 12, 18, 24, 30] as const;
export const PROJECTS_DEFAULT_PAGE_SIZE = PROJECTS_PAGE_SIZE_OPTIONS[0];

const findPage = (page?: number, size: number = PROJECTS_DEFAULT_PAGE_SIZE, search?: string) =>
    request<Page<Project>>(`/${URL}/page`, {
        params: {
            page,
            size,
            search
        }
    });

const findAllLight = async () => {
    const lightProjects = await request<ProjectLight[]>(`/${URL}/light`);
    lightProjects.sort((a, b) => a.sort - b.sort);
    return lightProjects;
};

const create = (project: ProjectCreation, file?: File | null) => {
    if (!file) {
        return request<Project, ProjectCreation>(`/${URL}`, {
            method: "POST",
            data: project
        });
    }

    return request<Project, FormData>(`/${URL}/with-image`, {
        method: "POST",
        data: buildProjectFormData(project, file),
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

const update = (project: Project, file?: File | null) => {
    if (!file) {
        return request<Project, Project>(`/${URL}/${project.id}`, {
            method: "PUT",
            data: project
        });
    }

    return request<Project, FormData>(`/${URL}/${project.id}/with-image`, {
        method: "PUT",
        data: buildProjectFormData(project, file),
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

const sort = (sorts: DndItem[]) => {
    return request<void, DndItem[]>(`/${URL}/sort`, {
        method: "PATCH",
        data: sorts
    });
};

const deleteProject = (id: number) =>
    request<void>(`/${URL}/${id}`, {
        method: "DELETE"
    });

const buildProjectFormData = (project: Project | ProjectCreation, file: File) => {
    return buildFormData(
        {
            type: "json",
            name: "project",
            value: project
        },
        {
            type: "blob",
            name: "file",
            value: file
        }
    );
};

export const ProjectService = {
    findPage,
    findAllLight,
    create,
    update,
    sort,
    delete: deleteProject
};
