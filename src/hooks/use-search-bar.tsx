import { useState } from "react";

type UseSearchBarOutput = {
    searchBarValue: string;
    setSearchBarValue: (value: string) => void;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
};

export const useSearchBar = (): UseSearchBarOutput => {
    const [searchBarValue, setSearchBarValue] = useState("");
    const [searchQuery, setSearchQuery] = useState(searchBarValue);

    return {
        searchBarValue,
        setSearchBarValue,
        searchQuery,
        setSearchQuery
    };
};
