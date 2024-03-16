import { zodResolver } from "@hookform/resolvers/zod";
import { UserService } from "api/services/user";
import { Page } from "components/common/page";
import { Button } from "components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import { useAuthContext } from "contexts/auth-context";
import { getFormattedTitleAndMessage } from "lib/utils/error";
import type { FC } from "react";
import { useLayoutEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AuthRequest } from "types/auth";
import { authRequestSchema } from "types/auth";

export const Login: FC = () => {

    const { accessToken, setAccessToken } = useAuthContext();

    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (accessToken) {
            navigate("/", { replace: true });
        }
    }, [ accessToken, navigate ]);

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const form = useForm<AuthRequest>({
        resolver: zodResolver(authRequestSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const submitHandler: SubmitHandler<AuthRequest> = async data => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const res = await UserService.login(data);
            if (res.roles.includes("ROLE_ADMIN")) {
                setAccessToken(res.accessToken);
            } else {
                toast.error("You must be an administrator to access the dashboard.");
            }
        } catch (e) {
            console.error("Login failed", getFormattedTitleAndMessage(e));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Page title="Login">
            <div className="h-screen-dynamic grid place-items-center">
                <Card className="w-[350px] max-w-[85%]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(submitHandler)}>
                            <CardHeader>
                                <CardTitle>Sign In</CardTitle>
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
                                                <Input {...field} type="password" autoComplete="current-password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">Submit</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </Page>
    );
};
