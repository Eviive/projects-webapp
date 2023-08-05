import type { useSortable } from "@dnd-kit/sortable";
import { createContext, useContext } from "react";

export type ISortableItemContext = Partial<Pick<ReturnType<typeof useSortable>, "attributes" | "listeners" | "setActivatorNodeRef">>;

const SortableItemContext = createContext<ISortableItemContext>({
    attributes: undefined,
    listeners: undefined,
    setActivatorNodeRef: () => console.warn("setAccessToken called without AuthContextProvider")
});

export const SortableItemContextProvider = SortableItemContext.Provider;

export const useSortableItemContext = () => useContext(SortableItemContext);
