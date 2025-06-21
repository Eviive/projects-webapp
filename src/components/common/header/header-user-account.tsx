import { queryClient } from "api/query-client";
import { UserService } from "api/services/user";
import { Button } from "components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { useAuthContext } from "contexts/auth-context";
import { clearAuthContext, hasEveryAuthority } from "libs/auth";
import { getDetail } from "libs/utils/error";
import { cn } from "libs/utils/style";
import type { FC } from "react";
import { LuUserRound } from "react-icons/lu";
import { NavLink, useLocation, useMatches, useNavigate } from "react-router";
import { toast } from "sonner";
import { authoritiesHandleSchema, type Authority } from "types/auth";
import type { HeaderTypeProps } from "types/header";

type Props = HeaderTypeProps & {
    classNames?: {
        item?: string;
        icon?: string;
    };
};

export const HeaderUserAccount: FC<Props> = props => {
    const { currentUser } = useAuthContext();

    const isLoggedIn = currentUser.id !== null;

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

    const buttonClasses = cn(
        props.classNames?.item,
        "border-0",
        props.type === "header" && "w-auto ms-auto gap-2 p-0"
    );

    const iconClasses = cn(props.classNames?.icon, "overflow-hidden rounded-full");

    let trigger = (
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className={buttonClasses}>
                {isLoggedIn ? (
                    <img
                        src="https://avatars.githubusercontent.com/u/80990528"
                        alt="Avatar"
                        className={cn(iconClasses, "h-full w-auto")}
                    />
                ) : (
                    <div className="bg-input grid aspect-square h-full place-items-center rounded-full">
                        <LuUserRound className={iconClasses} />
                    </div>
                )}
                {props.type === "header" && (
                    <span className="truncate">{currentUser.username}</span>
                )}
            </Button>
        </DropdownMenuTrigger>
    );

    if (props.type === "sidebar") {
        trigger = (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{trigger}</TooltipTrigger>
                    <TooltipContent side="right">{currentUser.username}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <DropdownMenu>
            {trigger}
            <DropdownMenuContent
                side={props.type === "sidebar" ? "right" : "bottom"}
                align={props.type === "sidebar" ? "center" : "end"}
                className={cn(props.type === "sidebar" && "my-3")}
            >
                <DropdownMenuLabel>{currentUser.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoggedIn ? (
                    <DropdownMenuItem
                        className="text-danger focus:text-danger"
                        onSelect={handleLogout}
                    >
                        Logout
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem asChild>
                        <NavLink to={loginHref}>Login</NavLink>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
