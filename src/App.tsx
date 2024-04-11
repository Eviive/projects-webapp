import { Toaster } from "components/ui/sonner";
import { type FC } from "react";
import { Outlet } from "react-router-dom";

import "./styles/reset.scss";

export const App: FC = () => {
    return (
        <div className="min-h-screen-dynamic flex min-h-screen flex-col">
            <Outlet />
            <Toaster />
        </div>
    );
};
