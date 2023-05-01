import { RequireAuth, Sidebar } from "components/common";
import { useAxiosConfig } from "hooks/useAxiosConfig";
import { FC } from "react";
import { Outlet } from "react-router-dom";

import styles from "./main.module.scss";

const Main: FC = () => {

    useAxiosConfig();

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
