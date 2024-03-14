import { useQueryClient } from "@tanstack/react-query";
import { UserService } from "api/services";
import { NavigationMenu, NavigationMenuList } from "components/ui/navigation-menu";
import { useAuthContext } from "contexts/AuthContext";
import { getFormattedTitleAndMessage } from "lib/utils/error";
import { type FC } from "react";
import { LuActivity, LuFolderCog, LuSettings2 } from "react-icons/lu";
import { toast } from "sonner";
import type { HeaderItem as HeaderItemType, HeaderMenu as HeaderMenuType } from "types/header";
import { HeaderItem } from "./HeaderItem";
import { HeaderMenu } from "./HeaderMenu";
import { HeaderThemeSwitcher } from "./HeaderThemeSwitcher";

export const Header: FC = () => {

    const { setAccessToken } = useAuthContext();

    const queryClient = useQueryClient();

    const headerItems: (HeaderItemType | HeaderMenuType)[] = [
        {
            type: "route",
            name: "Home",
            path: "/"
        },
        {
            type: "menu",
            name: "Data",
            description: "Manage the Personal-API data, your IT student projects and your technical skills.",
            icon: <LuFolderCog size={30} />,
            children: [
                {
                    type: "route",
                    name: "Projects",
                    description: "View and manage the projects you've worked on.",
                    path: "/projects"
                },
                {
                    type: "route",
                    name: "Skills",
                    description: "Track and manage your technical skills.",
                    path: "/skills"
                }
            ]
        },
        {
            type: "menu",
            name: "Monitoring",
            description: "View and analyze the metrics of the Personal-API.",
            icon: <LuActivity size={30} />,
            children: [
                {
                    type: "route",
                    name: "Health",
                    description: "View information about the latest API requests.",
                    path: "/health"
                }
            ]
        },
        {
            type: "menu",
            name: "Management",
            description: "Manage the Personal-API dashboard.",
            icon: <LuSettings2 size={30} />,
            children: [
                {
                    type: "action",
                    name: "Refresh",
                    description: "Update all dashboard information with the latest data.",
                    handleAction: () => queryClient.invalidateQueries()
                },
                {
                    type: "action",
                    name: "Logout",
                    description: "Sign out of the dashboard.",
                    handleAction: async () => {
                        try {
                            await UserService.logout();
                        } catch (e) {
                            console.error("Logout failed", getFormattedTitleAndMessage(e));
                        } finally {
                            setAccessToken("");
                            toast.success("You have been logged out");
                        }
                    },
                    danger: true
                }
            ]
        }
    ];

    return (
        <nav className="flex z-40 w-full h-auto items-center justify-center data-[menu-open=true]:border-none static border-b border-divider backdrop-blur-lg data-[menu-open=true]:backdrop-blur-xl backdrop-saturate-150 bg-background/70">
            <header className="z-40 flex px-6 gap-4 w-full flex-row relative flex-nowrap items-center justify-between h-16 max-w-[1024px]">
                <div className="flex h-full items-center text-lg font-bold basis-0 grow">
                    <img
                        className="object-cover h-full p-3.5"
                        src="/logo.svg"
                        alt="The logo of the Personal-API dashboard"
                    />
                    <h1 className="lg:block md:hidden">Dashboard</h1>
                </div>

                <NavigationMenu className="basis-0 grow">
                    <NavigationMenuList>
                        {headerItems.map(item => {
                            switch (item.type) {
                                case "route":
                                case "action":
                                    return (
                                        <HeaderItem key={item.name} item={item} />
                                    );
                                case "menu":
                                    return (
                                        <HeaderMenu key={item.name} menu={item} />
                                    );
                            }
                        })}
                    </NavigationMenuList>
                </NavigationMenu>

                <HeaderThemeSwitcher />
            </header>
        </nav>
    );
};
