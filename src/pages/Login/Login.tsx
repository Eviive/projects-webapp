import { UserService } from "api/services";
import { Button, Input, Page, Popup } from "components/common";
import { useAuthContext } from "contexts/AuthContext";
import { usePopup } from "hooks/usePopup";
import { FC, useLayoutEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaLock, FaUser } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { AuthRequest } from "types/forms";
import { getTitleAndMessage } from "utils/errors";

import styles from "./login.module.scss";

export const Login: FC = () => {

    const { accessToken, setAccessToken } = useAuthContext();

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const [ redirect, setRedirect ] = useState(false);

    const [ popup, showPopup ] = usePopup();

    const { register, handleSubmit } = useForm<AuthRequest>();

    useLayoutEffect(() => {
        if (accessToken) {
            setRedirect(true);
        }
    }, [accessToken]);

    const submitHandler: SubmitHandler<AuthRequest> = async data => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const res = await UserService.login(data);
            if (res.roles.includes("ROLE_ADMIN")) {
                setAccessToken(res.accessToken);
            } else {
                showPopup({
                    title: "Insufficient permissions",
                    message: "You must be an administrator to access the dashboard."
                });
            }
        } catch (e) {
            showPopup(getTitleAndMessage(e));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Page title="Login - Dashboard">
            { redirect
                ? <Navigate to="/" />
                : <>
                    <div className={styles.loginWrapper}>
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
                    <Popup {...popup} />
                </>
            }
        </Page>
    );
};
