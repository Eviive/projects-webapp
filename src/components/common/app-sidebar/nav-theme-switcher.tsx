import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "components/ui/dropdown-menu";
import { useThemeContext } from "contexts/theme-context";
import { useIsMobile } from "hooks/use-mobile";
import type { FC } from "react";
import { RxLaptop, RxMoon, RxSun } from "react-icons/rx";

export const NavThemeSwitcher: FC = () => {
    const { theme, systemTheme, setLightTheme, setDarkTheme, setSystemTheme } = useThemeContext();

    const currentTheme = theme === "system" ? systemTheme : theme;

    const isMobile = useIsMobile();

    return (
        <DropdownMenu>
            <DropdownMenuItem asChild>
                <DropdownMenuTrigger className="w-full">
                    {currentTheme === "light" && <RxSun />}
                    {currentTheme === "dark" && <RxMoon />}
                    <span className="truncate">Theme</span>
                </DropdownMenuTrigger>
            </DropdownMenuItem>
            <DropdownMenuContent side={isMobile ? "top" : "right"} sideOffset={9} align="center">
                <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={setLightTheme}>
                        <RxSun />
                        <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={setDarkTheme}>
                        <RxMoon />
                        <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={setSystemTheme}>
                        <RxLaptop />
                        <span>System</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
