import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

/*
	There is a comma after the type parameter ("T,") because there is a clash between the JSX and TypeScript syntax.
	The comma is required to disambiguate the two. Another way to do this would be to use the "extends" keyword ("T extends {}").
	See: https://stackoverflow.com/a/45576880
*/
export const useLocalStorage = <T,>(key: string, defaultValue: T): [ T, Dispatch<SetStateAction<T>> ] => {
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

    const setValue: Dispatch<SetStateAction<T>> = newValueOrFactory => {
        try {
            if (newValueOrFactory instanceof Function) {
                setStoredValue(prevState => {
                    const newState = newValueOrFactory(prevState);
                    localStorage.setItem(key, JSON.stringify(newState));
                    return newState;
                });
            } else {
                setStoredValue(newValueOrFactory);
                localStorage.setItem(key, JSON.stringify(newValueOrFactory));
            }
        } catch (e) {
            console.error(e);
        }
    };

    return [ storedValue, setValue ];
};
