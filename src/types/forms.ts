export type AuthRequest = {
    username: string;
    password: string;
}

export type AuthResponse = {
    username: string;
    roles: string[];
    accessToken: string;
}
