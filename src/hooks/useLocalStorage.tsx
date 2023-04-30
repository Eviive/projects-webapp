import { useState } from "react";

/*
	There is a comma after the type parameter ("T,") because there is a clash between the JSX and TypeScript syntax.
	The comma is required to disambiguate the two. Another way to do this would be to use the "extends" keyword ("T extends {}").
	See: https://stackoverflow.com/a/45576880
*/
export const useLocalStorage = <T,>(key: string, defaultValue: T): [T, (newValue: T) => void] => {
    const [ storedValue, setStoredValue ] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);

            if (item) {
                return JSON.parse(item);
            }

            localStorage.setItem(key, JSON.stringify(defaultValue));
        } catch (e) {
            console.error(e);
        }

        return defaultValue;
    });

    const setValue = (newValue: T) => {
        try {
            localStorage.setItem(key, JSON.stringify(newValue));
        } catch (e) {
            console.error(e);
        }

        setStoredValue(newValue);
    };

    return [ storedValue, setValue ];
};
