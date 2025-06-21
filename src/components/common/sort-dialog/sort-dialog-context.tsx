import type { SortDialogContentRef } from "components/common/sort-dialog/sort-dialog-content";
import type { Ref } from "react";
import { createContext, use } from "react";

interface ISortDialogContext {
    contentRef: Ref<SortDialogContentRef | null>;
    handleClose: (open: boolean, resetSort?: boolean) => void;
}

export const SortDialogContext = createContext<ISortDialogContext | null>(null);

export const useSortDialogContext = (): ISortDialogContext => {
    const sortDialogContext = use(SortDialogContext);
    if (sortDialogContext === null) {
        throw new Error("useSortDialogContext called without SortDialogContextProvider");
    }
    return sortDialogContext;
};
