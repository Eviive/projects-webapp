import { request } from "api/client";
import type { Skill } from "types/entities";

const URL = "skill";

const findById = (id: number) => request<Skill>(`/${URL}/${id}`, {}, false);

const findAll = () => request<Skill[]>(`/${URL}`, {}, false);

const save = (skill: Skill, file?: File | null) => {
    if (!file) {
        return request<Skill, Skill>(`/${URL}`, {
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

const buildFormData = (skill: Skill, file: File) => {
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
