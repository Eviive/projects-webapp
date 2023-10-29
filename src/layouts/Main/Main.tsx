import { Header, RequireAuth } from "components/common";
import type { FC } from "react";
import { Outlet } from "react-router-dom";

const Main: FC = () => {
    return (
        <>
            <Header />
            <main className="grow flex flex-col">
                <Outlet />
            </main>
        </>
    );
};

const MainWithAuth = RequireAuth(Main);

export { MainWithAuth as Main };
