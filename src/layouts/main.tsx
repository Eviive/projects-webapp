import { Header } from "components/common/header";
import { RequireAuth } from "components/common/require-auth";
import type { FC } from "react";
import { Outlet } from "react-router-dom";

const Main: FC = () => {
    return (
        <>
            <Header />
            <main className="flex grow flex-col sm:ml-14">
                <Outlet />
            </main>
        </>
    );
};

const MainWithAuth = RequireAuth(Main);

export { MainWithAuth as Main };
