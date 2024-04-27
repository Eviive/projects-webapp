import { request } from "api/client";
import type { AuthRequest, AuthResponse } from "types/auth";

const URL = "user";

const login = (authRequest: AuthRequest) =>
    request<AuthResponse, AuthRequest>(`/${URL}/login`, {
        method: "POST",
        data: authRequest,
        needsAuth: false
    });

const logout = () =>
    request<void>(`/${URL}/logout`, {
        method: "POST",
        needsAuth: false
    });

const refresh = (showErrorToast = true) =>
    request<AuthResponse>(`/${URL}/refresh`, {
        method: "POST",
        needsAuth: false,
        showErrorToast
    });

export const UserService = {
    login,
    logout,
    refresh
};
