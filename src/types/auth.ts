export type CurrentUser = CurrentLoggedInUser | CurrentAnonymousUser;

export interface CurrentLoggedInUser {
    username: string;
    email: string;
    name: string;
    authorities: Authority[];
    exp: number;
}

// TODO: include NON_NULL ??
export interface CurrentAnonymousUser {
    name: string;
    authorities: Authority[];
}

type Role = `ROLE_${"ANONYMOUS" | "ADMIN"}`;
type Scope =
    | "read:project"
    | "create:project"
    | "update:project"
    | "delete:project"
    | "read:skill"
    | "create:skill"
    | "update:skill"
    | "delete:skill"
    | "revalidate:portfolio";

export type Authority = Role | Scope;
