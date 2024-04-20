import { Page } from "components/common/page";
import { LoginForm } from "components/login/login-form";
import { type FC } from "react";

export const Login: FC = () => {
    return (
        <Page title="Login">
            <div className="grid grow place-items-center">
                <LoginForm />
            </div>
        </Page>
    );
};
