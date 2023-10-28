import { RequireAuth, Sidebar } from "components/common";
import type { FC } from "react";
import { Outlet } from "react-router-dom";

const Main: FC = () => {
    return (
        <>
            <Sidebar />
            <div className="grow ml-sidebar flex flex-col">
                <Outlet />
            </div>
        </>
    );
};

const MainWithAuth = RequireAuth(Main);

export { MainWithAuth as Main };
