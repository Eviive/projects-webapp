import { useEffect, useState } from "react";

const isMatching = (query: string): boolean => {
    return window.matchMedia(query).matches;
};

export const useMediaQuery = (
    mediaQuery: string,
    handleMatchChange?: (matches: boolean) => void
): boolean => {
    const [matches, setMatches] = useState(isMatching(mediaQuery));

    useEffect(() => {
        const matchMedia = window.matchMedia(mediaQuery);

        const handleChange = (e?: MediaQueryListEvent) => {
            setMatches(matchMedia.matches);
            if (e) {
                handleMatchChange?.(matchMedia.matches);
            }
        };

        handleChange();
        matchMedia.addEventListener("change", handleChange);

        return () => {
            matchMedia.removeEventListener("change", handleChange);
        };
    }, [handleMatchChange, mediaQuery]);

    return matches;
};
