import { useQueryClient } from "@tanstack/react-query";
import { UserService } from "api/services";
import { Button } from "components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "components/ui/navigation-menu";
import { useAuthContext } from "contexts/AuthContext";
import { useThemeContext } from "contexts/ThemeContext";
import { getFormattedTitleAndMessage } from "lib/utils/error";
import { cn } from "lib/utils/style";
import { type FC, useState } from "react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { LuActivity, LuFolderCog, LuSettings2 } from "react-icons/lu";
import { matchPath, NavLink, useLocation } from "react-router-dom";
import { toast } from "sonner";
import type { HeaderItem, HeaderRouteItem } from "types/header";
import { type HeaderMenu } from "types/header";

export const Header: FC = () => {

    const { setAccessToken } = useAuthContext();

    const queryClient = useQueryClient();

    const location = useLocation();

    const { theme, toggleTheme } = useThemeContext();

    const headerItems: (HeaderItem | HeaderMenu)[] = [
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

    const [ /*isMenuOpen*/, setIsMenuOpen ] = useState(false);

    const isHeaderRouteItemActive = (item: HeaderRouteItem): boolean => {
        return matchPath(item.path, location.pathname) !== null;
    };

    const isHeaderMenuActive = (menu: HeaderMenu): boolean => {
        return menu.children.some(i => i.type === "route" && isHeaderRouteItemActive(i));
    };

    const renderNavbarItem = (item: HeaderItem | HeaderMenu) => {
        switch (item.type) {
            case "route":
                return (
                    <NavigationMenuItem key={item.name}>
                        <NavigationMenuLink
                            asChild
                            className={cn(
                                navigationMenuTriggerStyle(),
                                "cursor-pointer",
                                item.danger && "text-danger hover:text-danger focus:text-danger"
                            )}
                            active={isHeaderRouteItemActive(item)}
                        >
                            <NavLink to={item.path}>
                                {item.name}
                            </NavLink>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                );
            case "action":
                return (
                    <NavigationMenuItem key={item.name}>
                        <NavigationMenuLink
                            className={cn(
                                navigationMenuTriggerStyle(),
                                "cursor-pointer",
                                item.danger && "text-danger hover:text-danger focus:text-danger"
                            )}
                            onClick={async () => {
                                await item.handleAction();
                                setIsMenuOpen(false);
                            }}
                        >
                            {item.name}
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                );
            case "menu":
                return (
                    <NavigationMenuItem key={item.name}>
                        <NavigationMenuTrigger {...isHeaderMenuActive(item) && { "data-active": "" }}>
                            {item.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 h-[320px] w-[500px] grid-cols-[.75fr_1fr] grid-rows-3">
                                <li className="row-span-3 flex h-full w-full flex-col rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline shadow-md">
                                    {item.icon}
                                    <span className="mb-2 mt-4 text-lg font-medium">{item.name}</span>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </li>
                                {item.children.map(child => (
                                    <li key={child.name}>
                                        {child.type === "route"
                                            ? (
                                                <NavigationMenuLink
                                                    asChild
                                                    active={isHeaderRouteItemActive(child)}
                                                >
                                                    <NavLink
                                                        to={child.path}
                                                        className={cn(
                                                            "h-full w-full block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                                            isHeaderRouteItemActive(child) && "bg-accent text-accent-foreground",
                                                            child.danger && "text-danger hover:text-danger focus:text-danger"
                                                        )}
                                                    >
                                                        <span className="text-sm font-medium leading-none">{child.name}</span>
                                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                            {child.description}
                                                        </p>
                                                    </NavLink>
                                                </NavigationMenuLink>
                                            )
                                            : (
                                                <NavigationMenuLink
                                                    className={cn(
                                                        "h-full w-full block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                                                        child.danger && "text-danger hover:text-danger focus:text-danger"
                                                    )}
                                                    onClick={child.handleAction}
                                                >
                                                    <span className="text-sm font-medium leading-none">{child.name}</span>
                                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                        {child.description}
                                                    </p>
                                                </NavigationMenuLink>
                                            )
                                        }
                                    </li>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                );
        }
    };

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
                        {headerItems.map(renderNavbarItem)}
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="basis-0 grow flex justify-end items-center">
                    <Button
                        className="text-foreground-500"
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                    >
                        {theme === "dark"
                            ? <BsFillMoonFill size={20} />
                            : <BsFillSunFill size={20} />
                        }
                    </Button>
                </div>
            </header>
        </nav>
    );
};
