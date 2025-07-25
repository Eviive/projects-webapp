export type CurrentUser = CurrentLoggedInUser | CurrentAnonymousUser;

export interface CurrentLoggedInUser {
    username: string;
    email: string;
    name: string;
    avatar: string;
    authorities: Authority[];
    exp: number;
}

export interface CurrentAnonymousUser {
    name: string;
    authorities: Authority[];
}

type Role = `ROLE_${"ANONYMOUS" | "ADMIN"}`;
type Permission =
    | "read:project"
    | "create:project"
    | "update:project"
    | "delete:project"
    | "read:skill"
    | "create:skill"
    | "update:skill"
    | "delete:skill"
    | "revalidate:portfolio";

export type Authority = Role | Permission;
