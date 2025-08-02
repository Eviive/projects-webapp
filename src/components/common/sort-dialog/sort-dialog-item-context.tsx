import type { useSortable } from "@dnd-kit/sortable";
import { createContext, use } from "react";

type ISortDialogItemContext = Pick<
    ReturnType<typeof useSortable>,
    "attributes" | "listeners" | "setActivatorNodeRef"
>;

export const SortDialogItemContext = createContext<ISortDialogItemContext | null>(null);

export const useSortDialogItemContext = (): ISortDialogItemContext => {
    const sortDialogItemContext = use(SortDialogItemContext);
    if (sortDialogItemContext === null) {
        throw new Error("useSortDialogItemContext called without SortDialogItemContextProvider");
    }
    return sortDialogItemContext;
};
