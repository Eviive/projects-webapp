import { z } from "zod";

export const authRequestSchema = z.object({
    username: z
        .string({
            required_error: "Username is required",
            invalid_type_error: "Username must be a string"
        })
        .min(1, "Username is required"),
    password: z
        .string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string"
        })
        .min(1, "Password is required")
});

export type AuthRequest = z.infer<typeof authRequestSchema>;

export type AuthResponse = {
    currentUser: CurrentUser;
    accessToken: string;
};

export type CurrentUser = {
    id: number | null;
    username: string;
    firstName: string | null;
    lastName: string | null;
    authorities: Authority[];
};

export type Authority = Role | Scope;

type Role = `ROLE_${RoleWithoutPrefix}`;
type RoleWithoutPrefix = "ANONYMOUS" | "ADMIN";

type Scope =
    | "read:projects"
    | "create:projects"
    | "update:projects"
    | "delete:projects"
    | "read:skills"
    | "create:skills"
    | "update:skills"
    | "delete:skills"
    | "revalidate:portfolio"
    | "read:actuator";
