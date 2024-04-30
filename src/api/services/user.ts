import { request } from "api/client";
import type { AuthRequest, AuthResponse, CurrentUser } from "types/auth";

const URL = "user";

const current = () => request<CurrentUser>(`/${URL}/current`);

const login = (authRequest: AuthRequest) =>
    request<AuthResponse, AuthRequest>(`/${URL}/login`, {
        method: "POST",
        data: authRequest
    });

const logout = () =>
    request<void>(`/${URL}/logout`, {
        method: "POST"
    });

const refresh = (showErrorToast = true) =>
    request<AuthResponse>(`/${URL}/refresh`, {
        method: "POST",
        showErrorToast
    });

export const UserService = {
    current,
    login,
    logout,
    refresh
};
