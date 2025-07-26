import { useQuery } from "@tanstack/react-query";
import { Button } from "components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Loader } from "components/ui/loader";
import type { Provider } from "libs/auth/providers";
import { disjunctionListFormatter } from "libs/intl-formatter";
import { loginQueryOptions } from "pages/login/login.loader";
import type { FC } from "react";
import type { IconType } from "react-icons";
import { LuLogIn } from "react-icons/lu";
import { SiAuthentik } from "react-icons/si";
import { useSearchParams } from "react-router";
import { capitalize } from "types/utils/string";

const providerIcons: Record<string, IconType> = {
    authentik: SiAuthentik
} satisfies Record<Provider, IconType>;

export const LoginForm: FC = () => {
    const loginQuery = useQuery(loginQueryOptions);

    const [searchParams] = useSearchParams();

    const loginSearchParams = new URLSearchParams({
        post_login_success_uri: import.meta.env.VITE_BASE_URL + (searchParams.get("redirect") ?? "")
    });
    const loginUriSearchParams = `?${loginSearchParams.toString()}`;

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="gap-3 text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                    <img
                        src="/logo.svg"
                        alt="Logo"
                        className="aspect-32/25 max-h-7 max-w-full object-cover"
                    />
                    Welcome back
                </CardTitle>
                {loginQuery.isSuccess && (
                    <CardDescription>
                        Login with your{" "}
                        {disjunctionListFormatter.format(
                            loginQuery.data.map(o => o.providerId).map(capitalize)
                        )}{" "}
                        account
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {loginQuery.isSuccess &&
                        loginQuery.data.map(o => {
                            const Icon = providerIcons[o.providerId] ?? LuLogIn;
                            return (
                                <Button
                                    asChild
                                    key={o.providerId}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <a href={`${o.loginUri}${loginUriSearchParams}`}>
                                        <Icon className="size-5" />
                                        Login with {capitalize(o.providerId)}
                                    </a>
                                </Button>
                            );
                        })}
                    {loginQuery.isLoading && <Loader defer />}
                </div>
            </CardContent>
        </Card>
    );
};
