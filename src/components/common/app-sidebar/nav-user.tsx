import { LogoutService } from "api/services/logout";
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
import { isLoggedIn } from "libs/auth/authorities";
import { clearAuthContext } from "libs/auth/context";
import type { FC } from "react";
import { LuChevronsUpDown, LuLogIn, LuLogOut, LuUserRound } from "react-icons/lu";
import { NavLink, useLocation } from "react-router";
import { toast } from "sonner";

export const NavUser: FC = () => {
    const { currentUser } = useAuthContext();

    const isUserLoggedIn = isLoggedIn(currentUser);

    const { isMobile } = useSidebar();
    const location = useLocation();

    const handleLogout = async () => {
        let redirectUri: string | null = null;
        try {
            redirectUri = await LogoutService.logout();
        } catch (e) {
            console.error("Logout failed:", e);
            await clearAuthContext(false);
            return;
        }

        if (redirectUri !== null) {
            window.location.replace(redirectUri);
        } else {
            toast.success("You have been logged out.");
            await clearAuthContext(false);
        }
    };

    let loginHref = "/login";
    if (location.pathname !== "/" || location.search !== "" || location.hash !== "") {
        const encodedCurrentUrl = encodeURIComponent(
            location.pathname + location.search + location.hash
        );
        loginHref += "?redirect=" + encodedCurrentUrl;
    }

    const userCard = (
        <>
            <Avatar className="h-8 w-8 rounded-lg">
                {isUserLoggedIn ? (
                    <>
                        <AvatarImage
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            fetchPriority="high"
                        />
                        <AvatarFallback className="rounded-lg">
                            {currentUser.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </>
                ) : (
                    <LuUserRound className="bg-sidebar-accent aspect-square size-full p-1" />
                )}
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentUser.name}</span>
                {isUserLoggedIn && <span className="truncate text-xs">{currentUser.email}</span>}
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
                        {isUserLoggedIn ? (
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
