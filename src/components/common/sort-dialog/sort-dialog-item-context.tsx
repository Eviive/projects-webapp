import type { useSortable } from "@dnd-kit/sortable";
import { createContext, useContext } from "react";

type ISortDialogItemContext = Pick<
    ReturnType<typeof useSortable>,
    "attributes" | "listeners" | "setActivatorNodeRef"
>;

const SortDialogItemContext = createContext<ISortDialogItemContext | null>(null);

export const SortDialogItemContextProvider = SortDialogItemContext.Provider;

export const useSortDialogItemContext = (): ISortDialogItemContext => {
    const sortDialogItemContext = useContext(SortDialogItemContext);
    if (sortDialogItemContext === null) {
        throw new Error("useSortDialogItemContext called without SortDialogItemContextProvider");
    }
    return sortDialogItemContext;
};
