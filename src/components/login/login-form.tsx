import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { UserService } from "api/services/user";
import { Button } from "components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import { setAuthContext } from "contexts/auth-context";
import { getDetail } from "libs/utils/error";
import type { FC } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AuthRequest } from "types/auth";
import { authRequestSchema } from "types/auth";

export const LoginForm: FC = () => {
    const form = useForm<AuthRequest>({
        resolver: zodResolver(authRequestSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const queryClient = useQueryClient();

    const submitHandler: SubmitHandler<AuthRequest> = async data => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const loginRes = await UserService.login(data);

            setAuthContext(loginRes);
            await queryClient.invalidateQueries();

            const redirectPath = searchParams.get("redirect") ?? "/";

            navigate(redirectPath, { replace: true });
        } catch (e) {
            console.error("Login failed:", getDetail(e));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitHandler)}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} autoComplete="username" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            autoComplete="current-password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Sign in
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
};
