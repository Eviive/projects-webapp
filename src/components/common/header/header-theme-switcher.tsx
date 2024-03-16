import { Button } from "components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "components/ui/dropdown-menu";
import { useThemeContext } from "contexts/theme-context";
import type { FC } from "react";
import { RxLaptop, RxMoon, RxSun } from "react-icons/rx";

export const HeaderThemeSwitcher: FC = () => {
    const {
        theme,
        systemTheme,
        setLightTheme,
        setDarkTheme,
        setSystemTheme
    } = useThemeContext();

    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <div className="basis-0 grow flex justify-end items-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        {currentTheme === "light" && (
                            <RxSun size={20} />
                        )}
                        {currentTheme === "dark" && (
                            <RxMoon size={20} />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-36">
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
