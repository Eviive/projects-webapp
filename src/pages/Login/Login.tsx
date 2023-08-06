import { UserService } from "api/services";
import { Button, Input, Page } from "components/common";
import { useAuthContext } from "contexts/AuthContext";
import type { FC } from "react";
import { useLayoutEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaLock, FaUser } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import type { AuthRequest } from "types/forms";
import { getTitleAndMessage } from "utils/errors";

import styles from "./login.module.scss";

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
            toast.error(getTitleAndMessage(e));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Page title="Login">
            { redirect
                ? <Navigate to="/" />
                : <div className={styles.loginWrapper}>
                    <form
                        className={styles.loginForm}
                        onSubmit={handleSubmit(submitHandler)}
                    >
                        <Input
                            attributes={{
                                ...register("username", { required: true }),
                                autoComplete: "username"
                            }}
                            label={<FaUser size={14} />}
                            wrapperClassName={styles.inputWrapper}
                        />
                        <Input
                            attributes={{
                                ...register("password", { required: true }),
                                type: "password",
                                autoComplete: "current-password"
                            }}
                            label={<FaLock size={14} />}
                            wrapperClassName={styles.inputWrapper}
                        />
                        <Button loading={isSubmitting}>Sign In</Button>
                    </form>
                </div>
            }
        </Page>
    );
};
