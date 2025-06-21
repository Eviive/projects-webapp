import { useTheme } from "hooks/use-theme";
import type { FC, PropsWithChildren } from "react";
import { createContext, use, useMemo } from "react";

type IThemeContext = ReturnType<typeof useTheme>;

const ThemeContext = createContext<IThemeContext | null>(null);

export const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const { theme, systemTheme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme();

    const themeContextValue = useMemo<IThemeContext>(
        () => ({
            theme,
            systemTheme,
            setLightTheme,
            setDarkTheme,
            setSystemTheme
        }),
        [theme, systemTheme, setLightTheme, setDarkTheme, setSystemTheme]
    );

    return <ThemeContext value={themeContextValue}>{children}</ThemeContext>;
};

export const useThemeContext = (): IThemeContext => {
    const themeContext = use(ThemeContext);
    if (themeContext === null) {
        throw new Error("useThemeContext called without ThemeContextProvider");
    }
    return themeContext;
};
