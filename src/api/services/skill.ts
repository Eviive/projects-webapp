import { request } from "api/client";

import type { Skill, SkillCreation } from "types/entities/skill";

const URL = "skill";

const findById = (id: number) => request<Skill>(`/${URL}/${id}`, { needsAuth: false });

const findAll = async () => {
    const skills = await request<Skill[]>(`/${URL}`, { needsAuth: false });
    skills.sort((a, b) => a.sort - b.sort);
    return skills;
};

const save = (skill: SkillCreation, file?: File | null) => {
    if (!file) {
        return request<Skill, SkillCreation>(`/${URL}`, {
            method: "POST",
            data: skill
        });
    }

    return request<Skill, FormData>(`/${URL}/with-image`, {
        method: "POST",
        data: buildFormData(skill, file),
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

const update = (skill: Skill, file?: File | null) => {
    if (!file) {
        return request<Skill, Skill>(`/${URL}/${skill.id}`, {
            method: "PUT",
            data: skill
        });
    }

    return request<Skill, FormData>(`/${URL}/${skill.id}/with-image`, {
        method: "PUT",
        data: buildFormData(skill, file),
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

const deleteSkill = (id: number) => request<void>(`/${URL}/${id}`, {
    method: "DELETE"
});

const buildFormData = (skill: Skill | SkillCreation, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("skill", new Blob([ JSON.stringify(skill) ], { type: "application/json" }));
    return formData;
};

export const SkillService = {
    findById,
    findAll,
    save,
    sort,
    update,
    delete: deleteSkill
};
