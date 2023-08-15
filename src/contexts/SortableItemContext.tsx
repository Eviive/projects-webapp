import type { useSortable } from "@dnd-kit/sortable";
import { createContext, useContext } from "react";

type ISortableItemContext = Pick<ReturnType<typeof useSortable>, "attributes" | "listeners" | "setActivatorNodeRef">;

const SortableItemContext = createContext<ISortableItemContext | null>(null);

export const SortableItemContextProvider = SortableItemContext.Provider;

export const useSortableItemContext = () => {
    const sortableItemContext = useContext(SortableItemContext);
    if (sortableItemContext === null) {
        throw new Error("useSortableItemContext called without SortableItemContextProvider");
    }
    return sortableItemContext;
};
