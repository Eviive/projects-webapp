import { useAxiosConfig } from "hooks/useAxiosConfig";
import { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { UserService } from "api/services";
import { useAuthContext } from "contexts/AuthContext";

import styles from "./main.module.scss";
import { Sidebar } from "../Sidebar/Sidebar";
import { RequireAuth } from "../RequireAuth/RequireAuth";

const Main: FC = () => {

    useAxiosConfig();

    const { setAccessToken } = useAuthContext();

    useEffect(() => {
        const persistLogin = async () => {
            try {
                const res = await UserService.refresh();
                setAccessToken(res.roles.includes("ROLE_ADMIN") ? res.accessToken : "");
            } catch (e) {
                console.error("Persistent login failed", e);
                setAccessToken("");
            }
        };
        persistLogin();
    }, [ setAccessToken ]);

    return (
        <>
            <Sidebar />
            <main className={styles.main}>
                <Outlet />
            </main>
        </>
    );
};

const MainWithAuth = RequireAuth(Main);

export { MainWithAuth as Main };
