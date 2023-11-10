import { ContextMenu, Header, RequireAuth } from "components/common";
import { ContextMenuContextProvider } from "contexts/ContextMenuContext";
import type { FC } from "react";
import { Outlet } from "react-router-dom";

const Main: FC = () => {
    return (
        <ContextMenuContextProvider>
            <Header />
            <main className="grow flex flex-col">
                <Outlet />
                <ContextMenu />
            </main>
        </ContextMenuContextProvider>
    );
};

const MainWithAuth = RequireAuth(Main);

export { MainWithAuth as Main };
