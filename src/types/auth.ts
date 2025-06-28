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

export interface AuthResponse {
    currentUser: CurrentUser;
    accessToken: string;
}

export interface CurrentUser {
    id: number | null;
    username: string;
    firstName: string | null;
    lastName: string | null;
    authorities: Authority[];
}

const roleWithoutPrefixSchema = z.enum(["ANONYMOUS", "ADMIN"]);
const roleSchema = roleWithoutPrefixSchema.transform(role => `ROLE_${role}` as const);

const scopeSchema = z.enum([
    "read:project",
    "create:project",
    "update:project",
    "delete:project",
    "read:skill",
    "create:skill",
    "update:skill",
    "delete:skill",
    "revalidate:portfolio"
]);

export const authoritySchema = z.union([roleSchema, scopeSchema]);

type Role = z.infer<typeof roleSchema>;
type Scope = z.infer<typeof scopeSchema>;

export type Authority = Role | Scope;

export const authoritiesHandleSchema = z.object({
    authorities: z.array(authoritySchema)
});
