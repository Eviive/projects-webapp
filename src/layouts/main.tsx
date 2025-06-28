import { AppSidebar } from "components/common/app-sidebar/app-sidebar";
import { SidebarProvider } from "components/ui/sidebar";
import type { FC } from "react";
import { Outlet } from "react-router";

export const Main: FC = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex grow flex-col">
                <Outlet />
            </main>
        </SidebarProvider>
    );
};
