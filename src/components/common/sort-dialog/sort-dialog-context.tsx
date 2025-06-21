import type { SortDialogContentRef } from "components/common/sort-dialog/sort-dialog-content";
import type { RefObject } from "react";
import { createContext, useContext } from "react";

interface ISortDialogContext {
    contentRef: RefObject<SortDialogContentRef | null>;
    handleClose: (open: boolean, resetSort?: boolean) => void;
}

export const SortDialogContext = createContext<ISortDialogContext | null>(null);

export const useSortDialogContext = (): ISortDialogContext => {
    const sortDialogContext = useContext(SortDialogContext);
    if (sortDialogContext === null) {
        throw new Error("useSortDialogContext called without SortDialogContextProvider");
    }
    return sortDialogContext;
};
