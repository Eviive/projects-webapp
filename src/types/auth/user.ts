import type { Authority } from "types/auth/authorities";

export type CurrentUser = CurrentLoggedInUser | CurrentAnonymousUser;

export interface CurrentLoggedInUser {
    username: string;
    email: string;
    name: string;
    avatar: string;
    authorities: Authority[];
}

interface CurrentAnonymousUser {
    name: string;
    authorities: Authority[];
}
