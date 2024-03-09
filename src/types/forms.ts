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
    username: string;
    roles: string[];
    accessToken: string;
};
