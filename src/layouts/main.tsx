import { Header } from "components/common/header";
import type { FC } from "react";
import { Outlet } from "react-router-dom";

export const Main: FC = () => {
    return (
        <>
            <Header />
            <main className="flex grow flex-col sm:ml-14">
                <Outlet />
            </main>
        </>
    );
};
