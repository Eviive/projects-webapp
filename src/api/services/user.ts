import { request } from "api/client";
import type { AuthRequest, AuthResponse, CurrentUser } from "types/auth";

const URL = "user";

const current = (needsAccessToken = true) =>
    request<CurrentUser & { username: string | null }>(`/${URL}/current`, { needsAccessToken });

const login = (authRequest: AuthRequest) =>
    request<AuthResponse, AuthRequest>(`/${URL}/login`, {
        method: "POST",
        data: authRequest
    });

const logout = () =>
    request(`/${URL}/logout`, {
        method: "POST"
    });

const refresh = () =>
    request<AuthResponse>(`/${URL}/refresh`, {
        method: "POST",
        needsAccessToken: false
    });

export const UserService = {
    current,
    login,
    logout,
    refresh
};
