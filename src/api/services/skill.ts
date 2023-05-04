import { request } from "api/client";
import { Skill } from "types/entities";

const URL = "skill";

const findById = (id: number) => request<Skill>(`/${URL}/${id}`, {}, false);

const findAll = () => request<Skill[]>(`/${URL}`, {}, false);

const save = (skill: Skill) => request<Skill, Skill>(`/${URL}`, {
    method: "POST",
    data: skill
});

const update = (skill: Skill) => request<Skill, Skill>(`/${URL}/${skill.id}`, {
    method: "PUT",
    data: skill
});

const deleteSkill = (id: number) => request<void>(`/${URL}/${id}`, {
    method: "DELETE"
});

const uploadImage = (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<Skill, FormData>(`/${URL}/${id}/upload-image`, {
        method: "POST",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const SkillService = {
    findById,
    findAll,
    save,
    update,
    delete: deleteSkill,
    uploadImage
};
