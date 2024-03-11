import { UserService } from "api/services";
import { Loader } from "components/common";
import { Toaster } from "components/ui/sonner";
import { useAuthContext } from "contexts/AuthContext";
import { useAxiosInterceptors } from "hooks/useAxiosInterceptors";
import { getFormattedTitleAndMessage } from "lib/utils/error";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import "./styles/reset.scss";

export const App: FC = () => {

    const { accessToken, setAccessToken } = useAuthContext();

    useAxiosInterceptors(accessToken, setAccessToken);

    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await UserService.refresh(false);
                setAccessToken(res.roles.includes("ROLE_ADMIN") ? res.accessToken : "");
            } catch (e) {
                console.error("Persistent login failed", getFormattedTitleAndMessage(e));
                setAccessToken("");
            } finally {
                setIsLoading(false);
            }
        })();
    }, [ setAccessToken ]);

    return (
        <>
            {!isLoading
                ? <Outlet />
                : <Loader />
            }
            <Toaster />
        </>
    );
};
