import type { useSortable } from "@dnd-kit/sortable";
import { createContext, useContext } from "react";

type ISortDialogContext = Pick<ReturnType<typeof useSortable>, "attributes" | "listeners" | "setActivatorNodeRef">;

const SortDialogContext = createContext<ISortDialogContext | null>(null);

export const SortDialogContextProvider = SortDialogContext.Provider;

export const useSortDialogContext = (): ISortDialogContext => {
    const sortDialogContext = useContext(SortDialogContext);
    if (sortDialogContext === null) {
        throw new Error("useSortDialogContext called without SortDialogContextProvider");
    }
    return sortDialogContext;
};
