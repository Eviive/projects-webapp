import { Toaster } from "components/ui/sonner";
import type { FC } from "react";
import { Outlet } from "react-router";

import "styles.css";

export const App: FC = () => {
    return (
        <>
            <Outlet />
            <Toaster />
        </>
    );
};
