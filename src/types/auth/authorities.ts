type Role = `ROLE_${"ANONYMOUS" | "USER" | "ADMIN"}`;

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
