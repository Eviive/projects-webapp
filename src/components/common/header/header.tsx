import { useQueryClient } from "@tanstack/react-query";
import { UserService } from "api/services/user";
import { HeaderItem } from "components/common/header/header-item";
import { HeaderMenu } from "components/common/header/header-menu";
import { HeaderThemeSwitcher } from "components/common/header/header-theme-switcher";
import { NavigationMenu, NavigationMenuList } from "components/ui/navigation-menu";
import { useAuthContext } from "contexts/auth-context";
import { getFormattedTitleAndMessage } from "lib/utils/error";
import { type FC } from "react";
import { LuActivity, LuFolderCog, LuSettings2 } from "react-icons/lu";
import { toast } from "sonner";
import type { HeaderItem as HeaderItemType, HeaderMenu as HeaderMenuType } from "types/header";

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
            description:
                "Manage the Personal-API data, your IT student projects and your technical skills.",
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
        <nav className="border-divider static z-40 flex h-auto w-full items-center justify-center border-b bg-background/70 backdrop-blur-lg backdrop-saturate-150 data-[menu-open=true]:border-none data-[menu-open=true]:backdrop-blur-xl">
            <header className="relative z-40 flex h-16 w-full max-w-[1024px] flex-row flex-nowrap items-center justify-between gap-4 px-6">
                <div className="hidden h-full grow basis-0 items-center text-lg font-bold md:flex">
                    <img
                        className="h-full object-cover p-3.5"
                        src="/logo.svg"
                        alt="The logo of the Personal-API dashboard"
                    />
                    <h1 className="hidden lg:block">Dashboard</h1>
                </div>

                <NavigationMenu className="grow basis-0">
                    <NavigationMenuList>
                        {headerItems.map(item => {
                            switch (item.type) {
                                case "route":
                                case "action":
                                    return <HeaderItem key={item.name} item={item} />;
                                case "menu":
                                    return <HeaderMenu key={item.name} menu={item} />;
                            }
                        })}
                    </NavigationMenuList>
                </NavigationMenu>

                <HeaderThemeSwitcher />
            </header>
        </nav>
    );
};
