import { request } from "api/client";
import { User } from "types/entities";
import { AuthRequest, AuthResponse } from "../../types/forms";

const URL = "user";

const findById = (id: number) => request<User>(`/${URL}/${id}`);

const findAll = () => request<User[]>(`/${URL}`);

const save = (user: User) => request<User, User>(`/${URL}`, {
    method: "POST",
    data: user
});

const update = (user: User) => request<User, User>(`/${URL}/${user.id}`, {
    method: "PUT",
    data: user
});

const deleteUser = (id: number) => request<void>(`/${URL}/${id}`, {
    method: "DELETE"
});

const login = (authRequest: AuthRequest) => request<AuthResponse, AuthRequest>(`/${URL}/login`, {
    method: "POST",
    data: authRequest
}, false);

const logout = () => request<void>(`/${URL}/logout`, {
    method: "POST"
}, false);

const refresh = () => request<AuthResponse>(`/${URL}/refresh`, {
    method: "POST"
}, false);

export const UserService = {
    findById,
    findAll,
    save,
    update,
    delete: deleteUser,
    login,
    logout,
    refresh
};
