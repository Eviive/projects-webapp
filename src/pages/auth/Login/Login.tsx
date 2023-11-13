import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { UserService } from "api/services";
import { Page } from "components/common";
import { useAuthContext } from "contexts/AuthContext";
import { getTitleAndMessage } from "libs/utils";
import type { FC } from "react";
import { useLayoutEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { AuthRequest } from "types/forms";

export const Login: FC = () => {

    const { accessToken, setAccessToken } = useAuthContext();

    const navigate = useNavigate();

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const { register, handleSubmit } = useForm<AuthRequest>();

    useLayoutEffect(() => {
        if (accessToken) {
            navigate("/", { replace: true });
        }
    }, [ accessToken, navigate ]);

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
            console.error("Login failed", getTitleAndMessage(e));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Page title="Login">
            <div className="h-screen-dynamic grid place-items-center">
                <Card className="w-96 max-w-[85%]">
                    <CardBody>
                        <form
                            className="p-3 grid grid-rows-3 gap-8"
                            onSubmit={handleSubmit(submitHandler)}
                        >
                            <Input
                                {...register("username")}
                                label="Username"
                                autoComplete="username"
                                isRequired
                            />
                            <Input
                                {...register("password")}
                                type="password"
                                label="Password"
                                autoComplete="current-password"
                                isRequired
                            />
                            <Button type="submit" isLoading={isSubmitting}>Sign In</Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </Page>
    );
};
