import { useLocalStorage } from "hooks/useLocalStorage";
import { useMediaQuery } from "hooks/useMediaQuery";
import type { Theme } from "types/app";

type UseThemeOutput = {
    theme: Theme;
    toggleTheme: () => void;
    setDarkTheme: () => void;
    setLightTheme: () => void;
};

const COLOR_SCHEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export const useTheme = (): UseThemeOutput => {

    const isDarkThemeOS = useMediaQuery(COLOR_SCHEME_MEDIA_QUERY, matches => {
        setTheme(matches ? "dark" : "light");
    });

    const [ theme, setTheme ] = useLocalStorage<Theme>(
        "theme",
        isDarkThemeOS ? "dark" : "light"
    );

    return {
        theme,
        toggleTheme: () => setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark"),
        setDarkTheme: () => setTheme("dark"),
        setLightTheme: () => setTheme("light")
    };
};
