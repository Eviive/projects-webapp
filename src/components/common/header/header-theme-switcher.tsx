import type { HeaderType } from "components/common/header/header";
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

type Props = {
    type: HeaderType;
    className?: string;
};

export const HeaderThemeSwitcher: FC<Props> = props => {
    const { theme, systemTheme, setLightTheme, setDarkTheme, setSystemTheme } = useThemeContext();

    const currentTheme = theme === "system" ? systemTheme : theme;

    let trigger = (
        <DropdownMenuTrigger asChild>
            <Button className={props.className}>
                {currentTheme === "light" && <RxSun className="h-6 w-6" />}
                {currentTheme === "dark" && <RxMoon className="h-6 w-6" />}
                {props.type === "header" && "Theme"}
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

    return (
        <div className="flex grow basis-0 items-center">
            <DropdownMenu>
                {trigger}
                <DropdownMenuContent
                    side={props.type === "sidebar" ? "right" : "bottom"}
                    align={props.type === "sidebar" ? "center" : "start"}
                    className={cn("ml-3 w-36", props.type === "header" && "mb-3")}
                >
                    <DropdownMenuLabel>Theme</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={setLightTheme}>
                            <RxSun className="mr-2 h-4 w-4" />
                            <span>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={setDarkTheme}>
                            <RxMoon className="mr-2 h-4 w-4" />
                            <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={setSystemTheme}>
                            <RxLaptop className="mr-2 h-4 w-4" />
                            <span>System</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
