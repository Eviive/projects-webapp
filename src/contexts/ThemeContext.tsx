import { useTheme } from "hooks/useTheme";
import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useLayoutEffect, useMemo } from "react";

type IThemeContext = ReturnType<typeof useTheme>;

const ThemeContext = createContext<IThemeContext | null>(null);

export const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {

    const { theme, toggleTheme, setDarkTheme, setLightTheme } = useTheme();

    const themeContextValue = useMemo<IThemeContext>(() => ({
        theme,
        toggleTheme,
        setDarkTheme,
        setLightTheme
    }), [ theme, toggleTheme, setDarkTheme, setLightTheme ]);

    useLayoutEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
            root.classList.remove("light");
        } else {
            root.classList.add("light");
            root.classList.remove("dark");
        }
    }, [ theme ]);

    return (
        <ThemeContext.Provider value={themeContextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = (): IThemeContext => {
    const themeContext = useContext(ThemeContext);
    if (themeContext === null) {
        throw new Error("useThemeContext called without ThemeContextProvider");
    }
    return themeContext;
};
