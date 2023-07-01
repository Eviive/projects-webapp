import { UserService } from "api/services";
import { Loader } from "components/common";
import { AuthContextProvider } from "contexts/AuthContext";
import { useAxiosConfig } from "hooks/useAxiosConfig";
import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import "styles/reset.scss";

export const App: FC = () => {

    const [ accessToken, setAccessToken ] = useState("");

    const [ isLoading, setIsLoading ] = useState(true);

    useAxiosConfig(accessToken, setAccessToken);

    useEffect(() => {
        (async () => {
            try {
                const res = await UserService.refresh();
                setAccessToken(res.roles.includes("ROLE_ADMIN") ? res.accessToken : "");
            } catch (e) {
                console.error("Persistent login failed", e);
                setAccessToken("");
            } finally {
                setIsLoading(false);
            }
        })();
    }, [setAccessToken]);

    return (
        <AuthContextProvider value={{
            accessToken,
            setAccessToken
        }}>
            { isLoading
                ? <Loader />
                : <Outlet />
            }
        </AuthContextProvider>
    );
};
