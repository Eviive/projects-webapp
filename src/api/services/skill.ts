import { requestData } from "api/client";
import { buildFormData } from "libs/utils/form-data";
import type { DndItem } from "types/dnd";
import type { Skill, SkillCreation } from "types/entities/skill";

import type { Slice } from "types/pagination/slice";

const URL = "/api/skill";

const findAll = async () => {
    const skills = await requestData<Skill[]>(URL, {
        requiredAuthorities: ["read:skill"]
    });
    skills.sort((a, b) => a.sort - b.sort);
    return skills;
};

export const SKILLS_DEFAULT_PAGE_SIZE = 24;

const findSlice = async (page?: number, size = SKILLS_DEFAULT_PAGE_SIZE, search?: string) =>
    requestData<Slice<Skill>>(`${URL}/slice`, {
        params: {
            page,
            size,
            search
        },
        requiredAuthorities: ["read:skill"]
    });

const create = (skill: SkillCreation, file?: File | null) => {
    if (!file) {
        return requestData<Skill, SkillCreation>(URL, {
            method: "POST",
            data: skill,
            requiredAuthorities: ["create:skill"]
        });
    }

    return requestData<Skill, FormData>(`${URL}/with-image`, {
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
        return requestData<Skill, Skill>(`${URL}/${skill.id.toString()}`, {
            method: "PUT",
            data: skill,
            requiredAuthorities: ["update:skill"]
        });
    }

    return requestData<Skill, FormData>(`${URL}/${skill.id.toString()}/with-image`, {
        method: "PUT",
        data: buildSkillFormData(skill, file),
        headers: {
            "Content-Type": "multipart/form-data"
        },
        requiredAuthorities: ["update:skill"]
    });
};

const sort = (sorts: DndItem[]) => {
    return requestData<undefined, DndItem[]>(`${URL}/sort`, {
        method: "PATCH",
        data: sorts,
        requiredAuthorities: ["update:skill"]
    });
};

const deleteSkill = (id: number) =>
    requestData(`${URL}/${id.toString()}`, {
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
