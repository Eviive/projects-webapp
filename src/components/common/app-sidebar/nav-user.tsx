"use client";

import { queryClient } from "api/query-client";
import { UserService } from "api/services/user";
import { NavThemeSwitcher } from "components/common/app-sidebar/nav-theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "components/ui/sidebar";
import { useAuthContext } from "contexts/auth-context";
import { clearAuthContext, hasEveryAuthority } from "libs/auth";
import { getDetail } from "libs/utils/error";
import type { FC } from "react";
import { LuChevronsUpDown, LuLogIn, LuLogOut, LuUserRound } from "react-icons/lu";
import { NavLink, useLocation, useMatches, useNavigate } from "react-router";
import { toast } from "sonner";
import type { Authority } from "types/auth";
import { authoritiesHandleSchema } from "types/auth";

const AVATAR = "https://avatars.githubusercontent.com/u/80990528";

export const NavUser: FC = () => {
    const { currentUser } = useAuthContext();

    const isLoggedIn = currentUser.id !== null;

    const { isMobile } = useSidebar();
    const location = useLocation();
    const matches = useMatches();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await UserService.logout();
        } catch (e) {
            console.error("Logout failed:", getDetail(e));
        } finally {
            toast.success("You have been logged out.");
            const { currentUser: newCurrentUser } = await clearAuthContext(false);

            const requiredAuthoritiesToStay = new Set<Authority>();

            for (const match of matches) {
                const dataParseResult = authoritiesHandleSchema.safeParse(match.handle);

                if (dataParseResult.success) {
                    for (const authority of dataParseResult.data.authorities) {
                        requiredAuthoritiesToStay.add(authority);
                    }
                }
            }

            const canStayOnCurrentMatch = hasEveryAuthority(
                Array.from(requiredAuthoritiesToStay),
                newCurrentUser.authorities
            );

            if (!canStayOnCurrentMatch) {
                await navigate("/");
            }

            await queryClient.invalidateQueries({
                refetchType: canStayOnCurrentMatch ? "active" : "none"
            });
        }
    };

    const currentUrl = location.pathname + location.search;

    let loginHref = "/login";
    if (currentUrl !== `${import.meta.env.VITE_ROUTER_BASE_URL ?? ""}/`) {
        loginHref += `?redirect=${encodeURIComponent(currentUrl)}`;
    }

    const userCard = (
        <>
            <Avatar className="h-8 w-8 rounded-lg">
                {isLoggedIn ? (
                    <>
                        <AvatarImage src={AVATAR} alt={currentUser.username} />
                        <AvatarFallback className="rounded-lg">
                            {currentUser.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </>
                ) : (
                    <LuUserRound className="bg-sidebar-accent aspect-square size-full p-1" />
                )}
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentUser.username}</span>
                {currentUser.firstName && currentUser.lastName && (
                    <span className="truncate text-xs">
                        {currentUser.firstName} {currentUser.lastName}
                    </span>
                )}
            </div>
        </>
    );

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            {userCard}
                            <LuChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "top" : "right"}
                        sideOffset={4}
                        align="end"
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                {userCard}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <NavThemeSwitcher />
                        <DropdownMenuSeparator />
                        {isLoggedIn ? (
                            <DropdownMenuItem onSelect={handleLogout}>
                                <LuLogOut />
                                Logout
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem asChild>
                                <NavLink to={loginHref}>
                                    <LuLogIn />
                                    Login
                                </NavLink>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};
