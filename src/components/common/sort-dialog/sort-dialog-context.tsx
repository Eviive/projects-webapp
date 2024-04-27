import type { SortDialogContentRef } from "components/common/sort-dialog/sort-dialog-content";
import type { RefObject } from "react";
import { createContext, useContext } from "react";

type ISortDialogContext = {
    contentRef: RefObject<SortDialogContentRef>;
    handleClose: (open: boolean, resetSort?: boolean) => void;
};

const SortDialogContext = createContext<ISortDialogContext | null>(null);

export const SortDialogContextProvider = SortDialogContext.Provider;

export const useSortDialogContext = (): ISortDialogContext => {
    const sortDialogContext = useContext(SortDialogContext);
    if (sortDialogContext === null) {
        throw new Error("useSortDialogContext called without SortDialogContextProvider");
    }
    return sortDialogContext;
};
