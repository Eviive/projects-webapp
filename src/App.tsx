import { Toaster } from "components/ui/sonner";
import { useAuthContext } from "contexts/auth-context";
import type { FC } from "react";
import { Outlet } from "react-router-dom";

import "./styles/reset.scss";

export const App: FC = () => {
    const { currentUser } = useAuthContext();

    return (
        <>
            <Outlet key={currentUser.id} />
            <Toaster />
        </>
    );
};
