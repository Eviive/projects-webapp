import { request } from "api/client";
import type { Role } from "types/entities";

const URL = "role";

const findById = (id: number) => request<Role>(`/${URL}/${id}`);

const findAll = () => request<Role[]>(`/${URL}`);

export const RoleService = {
    findById,
    findAll
};
