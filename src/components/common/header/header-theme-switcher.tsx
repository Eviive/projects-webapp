import { Button } from "components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { useThemeContext } from "contexts/theme-context";
import { cn } from "libs/utils/style";
import type { FC } from "react";
import { RxLaptop, RxMoon, RxSun } from "react-icons/rx";
import type { HeaderTypeProps } from "types/header";

type Props = HeaderTypeProps & {
    classNames?: {
        item?: string;
        icon?: string;
    };
};

export const HeaderThemeSwitcher: FC<Props> = props => {
    const { theme, systemTheme, setLightTheme, setDarkTheme, setSystemTheme } = useThemeContext();

    const currentTheme = theme === "system" ? systemTheme : theme;

    let trigger = (
        <DropdownMenuTrigger asChild>
            <Button className={props.classNames?.item}>
                {currentTheme === "light" && <RxSun className={props.classNames?.icon} />}
                {currentTheme === "dark" && <RxMoon className={props.classNames?.icon} />}
                {props.type === "header" && <span className="truncate">Theme</span>}
            </Button>
        </DropdownMenuTrigger>
    );

    if (props.type === "sidebar") {
        trigger = (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{trigger}</TooltipTrigger>
                    <TooltipContent side="right">Theme</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    const themeIconClasses = "mr-2 size-4";

    return (
        <div className="flex grow basis-0 items-center">
            <DropdownMenu>
                {trigger}
                <DropdownMenuContent
                    side={props.type === "sidebar" ? "right" : "bottom"}
                    align={props.type === "sidebar" ? "center" : "start"}
                    className={cn(props.type === "sidebar" && "my-3")}
                >
                    <DropdownMenuLabel>Theme</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={setLightTheme}>
                            <RxSun className={themeIconClasses} />
                            <span>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={setDarkTheme}>
                            <RxMoon className={themeIconClasses} />
                            <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={setSystemTheme}>
                            <RxLaptop className={themeIconClasses} />
                            <span>System</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
