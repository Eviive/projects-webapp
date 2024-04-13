import { request } from "api/client";
import { buildFormData } from "libs/utils/form-data";
import type { DndItem } from "types/dnd";

import type { Project, ProjectCreation } from "types/entities/project";
import type { Skill } from "types/entities/skill";

const URL = "project";

const findAll = () => request<Project[]>(`/${URL}`);

const save = (project: ProjectCreation, file?: File | null) => {
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

    return request<Skill, FormData>(`/${URL}/${project.id}/with-image`, {
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
    findAll,
    save,
    update,
    sort,
    delete: deleteProject
};
