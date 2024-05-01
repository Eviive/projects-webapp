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
import { clearAuthContext } from "libs/auth";
import { getDetail } from "libs/utils/error";
import { cn } from "libs/utils/style";
import type { FC } from "react";
import { LuUser2 } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
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

    const handleLogout = async () => {
        try {
            await UserService.logout();
        } catch (e) {
            console.error("Logout failed:", getDetail(e));
        } finally {
            toast.success("You have been logged out.");
            await clearAuthContext(false);
        }
    };

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
                    <div className="grid aspect-square h-full place-items-center rounded-full bg-input">
                        <LuUser2 className={iconClasses} />
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
                        <NavLink to="/login">Login</NavLink>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
