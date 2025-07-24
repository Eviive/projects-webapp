import { getDetail } from "libs/utils/error";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

type UseLocalStorageOutput<T> = [T, Dispatch<SetStateAction<T>>];

/*
    There is a comma after the type parameter ("T,") because there is a clash between the JSX and TypeScript syntax.
    The comma is required to disambiguate the two. Another way to do this would be to use the "extends" keyword ("T extends {}").
    See: https://stackoverflow.com/a/45576880
*/
export const useLocalStorage = <T>(key: string, defaultValue: T): UseLocalStorageOutput<T> => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);

            if (item !== null) {
                return JSON.parse(item) as T;
            }

            localStorage.setItem(key, JSON.stringify(defaultValue));
        } catch (e) {
            console.error(`Error while initializing local storage key "${key}":`, getDetail(e));
        }

        return defaultValue;
    });

    const setValue: Dispatch<SetStateAction<T>> = newValueOrFactory => {
        try {
            setStoredValue(prevState => {
                const newState =
                    newValueOrFactory instanceof Function
                        ? newValueOrFactory(prevState)
                        : newValueOrFactory;

                if (newState === prevState) return prevState;

                localStorage.setItem(key, JSON.stringify(newState));
                return newState;
            });
        } catch (e) {
            console.error(`Error while setting local storage key "${key}":`, getDetail(e));
        }
    };

    return [storedValue, setValue];
};
