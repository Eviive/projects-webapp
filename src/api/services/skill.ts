import { request } from "api/client";
import { buildFormData } from "libs/utils/form-data";
import type { DndItem } from "types/dnd";
import type { Skill, SkillCreation } from "types/entities/skill";
import type { Slice } from "types/pagination";

const URL = "skill";

const findAll = async () => {
    const skills = await request<Skill[]>(`/${URL}`, {
        requiredAuthorities: ["read:skill"]
    });
    skills.sort((a, b) => a.sort - b.sort);
    return skills;
};

export const SKILLS_DEFAULT_PAGE_SIZE = 24;

const findSlice = async (page?: number, size = SKILLS_DEFAULT_PAGE_SIZE, search?: string) =>
    request<Slice<Skill>>(`/${URL}/slice`, {
        params: {
            page,
            size,
            search
        },
        requiredAuthorities: ["read:skill"]
    });

const create = (skill: SkillCreation, file?: File | null) => {
    if (!file) {
        return request<Skill, SkillCreation>(`/${URL}`, {
            method: "POST",
            data: skill,
            requiredAuthorities: ["create:skill"]
        });
    }

    return request<Skill, FormData>(`/${URL}/with-image`, {
        method: "POST",
        data: buildSkillFormData(skill, file),
        headers: {
            "Content-Type": "multipart/form-data"
        },
        requiredAuthorities: ["create:skill"]
    });
};

const update = (skill: Skill, file?: File | null) => {
    if (!file) {
        return request<Skill, Skill>(`/${URL}/${skill.id}`, {
            method: "PUT",
            data: skill,
            requiredAuthorities: ["update:skill"]
        });
    }

    return request<Skill, FormData>(`/${URL}/${skill.id}/with-image`, {
        method: "PUT",
        data: buildSkillFormData(skill, file),
        headers: {
            "Content-Type": "multipart/form-data"
        },
        requiredAuthorities: ["update:skill"]
    });
};

const sort = (sorts: DndItem[]) => {
    return request<void, DndItem[]>(`/${URL}/sort`, {
        method: "PATCH",
        data: sorts,
        requiredAuthorities: ["update:skill"]
    });
};

const deleteSkill = (id: number) =>
    request<void>(`/${URL}/${id}`, {
        method: "DELETE",
        requiredAuthorities: ["delete:skill"]
    });

const buildSkillFormData = (skill: Skill | SkillCreation, file: File) => {
    return buildFormData(
        {
            type: "json",
            name: "skill",
            value: skill
        },
        {
            type: "blob",
            name: "file",
            value: file
        }
    );
};

export const SkillService = {
    findAll,
    findSlice,
    create,
    update,
    sort,
    delete: deleteSkill
};
