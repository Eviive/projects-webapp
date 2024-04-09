import { Page } from "components/common/page";
import { LoginForm } from "components/login/login-form";
import { useAuthContext } from "contexts/auth-context";
import type { FC } from "react";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Login: FC = () => {
    const { accessToken } = useAuthContext();

    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (accessToken) {
            navigate("/", { replace: true });
        }
    }, [accessToken, navigate]);

    return (
        <Page title="Login">
            <div className="grid h-screen-dynamic place-items-center">
                <LoginForm />
            </div>
        </Page>
    );
};
