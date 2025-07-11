import { useQuery } from "@tanstack/react-query";
import { PortfolioService } from "api/services/portfolio";
import { NavUser } from "components/common/app-sidebar/nav-user";
import { RequireAuthority } from "components/common/require-authority";
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
import { getDetail } from "libs/utils/error";
import { infoQueryOptions } from "pages/home/home.loader";
import type { FC } from "react";
import type { IconType } from "react-icons";
import { LuFolder, LuHouse, LuRefreshCw, LuUserRoundCog } from "react-icons/lu";
import { NavLink } from "react-router";
import { toast } from "sonner";
import type { Authority } from "types/auth";
import { capitalize } from "types/utils/string";

interface LinkItem {
    type: "link";
    url: string;
}

interface ButtonItem {
    type: "button";
    action: () => void | Promise<void>;
}

type Item = (LinkItem | ButtonItem) & {
    title: string;
    icon: IconType;
    requiredAuthorities?: Authority | Authority[];
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
        type: "button",
        title: "Revalidate portfolio",
        icon: LuRefreshCw,
        requiredAuthorities: "revalidate:portfolio",
        action: async () => {
            try {
                await PortfolioService.revalidate();
                toast.success("Portfolio successfully revalidated.");
            } catch (e) {
                const message = "Portfolio revalidation failed:";
                toast.error(message + " " + getDetail(e));
                console.error(message, e);
            }
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
                    {infoQuery.isSuccess && (
                        <span className="text-muted-foreground truncate text-xs">
                            {`${capitalize(infoQuery.data.app.stage)} ${infoQuery.data.app.version}`}
                        </span>
                    )}
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
                                const item = (
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
                                if (!i.requiredAuthorities) {
                                    return item;
                                }
                                return (
                                    <RequireAuthority
                                        key={i.title}
                                        authority={i.requiredAuthorities}
                                    >
                                        {item}
                                    </RequireAuthority>
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
