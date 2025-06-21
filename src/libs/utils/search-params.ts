import { isNotNullOrUndefined, isNullOrUndefined } from "libs/utils/assertion";
import type { Dispatch, SetStateAction } from "react";

export const getNumberSearchParam = (
    searchParams: URLSearchParams,
    key: string
): number | undefined => {
    const value = searchParams.get(key);

    let number = value ? parseInt(value, 10) : undefined;

    if (isNotNullOrUndefined(number) && isNaN(number)) {
        number = undefined;
    }

    return number;
};

interface UpdateSearchParams {
    key: string;
    value: string | number | null | undefined;
}

export const updateSearchParams = (
    setSearchParams: Dispatch<SetStateAction<URLSearchParams>>,
    ...updates: UpdateSearchParams[]
): void => {
    setSearchParams(prevSearchParams => {
        const searchParams = new URLSearchParams(prevSearchParams);

        for (const { key, value } of updates) {
            if (
                isNullOrUndefined(value) ||
                (typeof value === "string" && value.trim() === "") ||
                (typeof value === "number" && isNaN(value))
            ) {
                searchParams.delete(key);
            } else {
                searchParams.set(key, value.toString());
            }
        }

        return searchParams;
    });
};
