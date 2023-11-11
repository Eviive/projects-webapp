import { Button, Card, CardBody } from "@nextui-org/react";
import { UserService } from "api/services";
import { Input, Page } from "components/common";
import { useAuthContext } from "contexts/AuthContext";
import { getTitleAndMessage } from "libs/utils";
import type { FC } from "react";
import { useLayoutEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import type { AuthRequest } from "types/forms";

export const Login: FC = () => {

    const { accessToken, setAccessToken } = useAuthContext();

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const [ redirect, setRedirect ] = useState(false);

    const { register, handleSubmit } = useForm<AuthRequest>();

    useLayoutEffect(() => {
        if (accessToken) {
            setRedirect(true);
        }
    }, [ accessToken ]);

    const submitHandler: SubmitHandler<AuthRequest> = async data => {
        console.log("Login", data);
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
            console.error("Login failed", getTitleAndMessage(e));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Page title="Login">
            { redirect

                ? <Navigate to="/" />

                : <div className="h-screen-dynamic grid place-items-center">
                    <Card className="w-96 max-w-[85%]">
                        <CardBody>
                            <form
                                className="p-3 grid grid-rows-3 gap-8"
                                onSubmit={handleSubmit(submitHandler)}
                            >
                                <Input
                                    {...register("username")}
                                    required={true}
                                    autoComplete="username"
                                    label="Username"
                                />
                                <Input
                                    {...register("password")}
                                    type="password"
                                    required={true}
                                    autoComplete="current-password"
                                    label="Password"
                                />
                                <Button type="submit" isLoading={isSubmitting}>Sign In</Button>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            }
        </Page>
    );
};
