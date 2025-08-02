import { requestData } from "api/client";
import { buildFormData } from "libs/utils/form-data";
import type { DndItem } from "types/dnd";
import type { Project, ProjectCreation } from "types/entities/project";
import type { ProjectLight } from "types/entities/project-light";
import type { Page } from "types/pagination/page";

const URL = "/api/project";

export const PROJECTS_PAGE_SIZE_OPTIONS = [6, 12, 18, 24, 30] as const;
export const PROJECTS_DEFAULT_PAGE_SIZE = PROJECTS_PAGE_SIZE_OPTIONS[0];

const findPage = (page?: number, size: number = PROJECTS_DEFAULT_PAGE_SIZE, search?: string) =>
    requestData<Page<Project>>(`${URL}/page`, {
        params: {
            page,
            size,
            search
        },
        requiredAuthorities: ["read:project"]
    });

const findAllLight = async () => {
    const lightProjects = await requestData<ProjectLight[]>(`${URL}/light`, {
        requiredAuthorities: ["read:project"]
    });
    lightProjects.sort((a, b) => a.sort - b.sort);
    return lightProjects;
};

const create = (project: ProjectCreation, file?: File | null) => {
    if (!file) {
        return requestData<Project, ProjectCreation>(URL, {
            method: "POST",
            data: project,
            requiredAuthorities: ["create:project"]
        });
    }

    return requestData<Project, FormData>(`${URL}/with-image`, {
        method: "POST",
        data: buildProjectFormData(project, file),
        headers: {
            "Content-Type": "multipart/form-data"
        },
        requiredAuthorities: ["create:project"]
    });
};

const update = (project: Project, file?: File | null) => {
    if (!file) {
        return requestData<Project, Project>(`${URL}/${project.id.toString()}`, {
            method: "PUT",
            data: project,
            requiredAuthorities: ["update:project"]
        });
    }

    return requestData<Project, FormData>(`${URL}/${project.id.toString()}/with-image`, {
        method: "PUT",
        data: buildProjectFormData(project, file),
        headers: {
            "Content-Type": "multipart/form-data"
        },
        requiredAuthorities: ["update:project"]
    });
};

const sort = (sorts: DndItem[]) => {
    return requestData<undefined, DndItem[]>(`${URL}/sort`, {
        method: "PATCH",
        data: sorts,
        requiredAuthorities: ["update:project"]
    });
};

const deleteProject = (id: number) =>
    requestData(`${URL}/${id.toString()}`, {
        method: "DELETE",
        requiredAuthorities: ["delete:project"]
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
