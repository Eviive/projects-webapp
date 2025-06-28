import { useQuery } from "@tanstack/react-query";
import { NavUser } from "components/common/app-sidebar/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail
} from "components/ui/sidebar";
import { Skeleton } from "components/ui/skeleton";
import { infoQueryOptions } from "pages/home/home.loader";
import type { FC } from "react";
import type { IconType } from "react-icons";
import { LuActivity, LuFolder, LuHouse, LuRefreshCw, LuUserRoundCog } from "react-icons/lu";
import { NavLink } from "react-router";

interface LinkItem {
    type: "link";
    url: string;
}

interface ButtonItem {
    type: "button";
    action: () => void;
}

type Item = (LinkItem | ButtonItem) & {
    title: string;
    icon: IconType;
};

const items: Item[] = [
    {
        type: "link",
        title: "Home",
        icon: LuHouse,
        url: "/"
    },
    {
        type: "link",
        title: "Projects",
        icon: LuFolder,
        url: "/projects"
    },
    {
        type: "link",
        title: "Skills",
        icon: LuUserRoundCog,
        url: "/skills"
    },
    {
        type: "link",
        title: "Health",
        icon: LuActivity,
        url: "/health"
    },
    {
        type: "button",
        title: "Revalidate portfolio",
        icon: LuRefreshCw,
        action: () => {
            console.log("Revalidate portfolio");
        }
    }
];

export const AppSidebar: FC = () => {
    const infoQuery = useQuery(infoQueryOptions);

    const logoSrc = `${import.meta.env.VITE_ROUTER_BASE_URL ?? ""}/logo.svg`;

    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader className="flex flex-row items-center gap-2 overflow-hidden p-4 transition-[padding] [[data-state=collapsed]_&]:p-2">
                <img
                    src={logoSrc}
                    alt="Logo"
                    className="aspect-32/25 max-h-9 max-w-full object-cover"
                />
                <div className="flex flex-col">
                    <span className="truncate text-sm font-semibold">Personal-API</span>
                    <span className="text-muted-foreground truncate text-xs">
                        {infoQuery.isLoading && <Skeleton className="h-[1lh] w-[4ch]" />}
                        {infoQuery.isSuccess && infoQuery.data.app.version}
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(i => {
                                const content = (
                                    <>
                                        <i.icon />
                                        <span>{i.title}</span>
                                    </>
                                );
                                return (
                                    <SidebarMenuItem key={i.title}>
                                        {i.type === "link" ? (
                                            <SidebarMenuButton asChild>
                                                <NavLink to={i.url}>{content}</NavLink>
                                            </SidebarMenuButton>
                                        ) : (
                                            <SidebarMenuButton onClick={i.action}>
                                                {content}
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
};
