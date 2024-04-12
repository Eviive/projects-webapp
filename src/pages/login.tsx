import { Page } from "components/common/page";
import { LoginForm } from "components/login/login-form";
import { authContext } from "contexts/auth-context";
import { type FC, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Login: FC = () => {
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (authContext.accessToken !== null) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    return (
        <Page title="Login">
            <div className="grid grow place-items-center">
                <LoginForm />
            </div>
        </Page>
    );
};
