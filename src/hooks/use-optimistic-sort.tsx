import {
    type InfiniteData,
    type MutationKey,
    type UseInfiniteQueryResult,
    useMutationState,
    type UseQueryResult
} from "@tanstack/react-query";
import { useMemo } from "react";
import type { DndItem } from "types/dnd";
import type { Page, Slice } from "types/pagination";

export const useOptimisticSort = <I extends DndItem>(
    sortMutationKey: MutationKey,
    itemsQuery:
        | UseQueryResult<I[] | Slice<I> | Page<I>>
        | UseInfiniteQueryResult<InfiniteData<Slice<I> | Page<I>>>
): [I[], Record<number, number>] => {
    const optimisticSorts = useMutationState<DndItem[]>({
        filters: {
            mutationKey: sortMutationKey,
            status: "pending"
        },
        select: mutation => mutation.state.variables as DndItem[]
    });

    const optimisticSortItems = useMemo(() => {
        const items: Record<number, number> = {};

        for (const sortItem of optimisticSorts.flat()) {
            items[sortItem.id] = sortItem.sort;
        }

        return items;
    }, [optimisticSorts]);

    const optimisticItems = useMemo((): I[] => {
        if (!itemsQuery.isSuccess) return [];

        let tempOptimisticItems: I[];
        if (Array.isArray(itemsQuery.data)) {
            tempOptimisticItems = [...itemsQuery.data];
        } else if ("pages" in itemsQuery.data) {
            tempOptimisticItems = itemsQuery.data.pages.flatMap(page => page.content);
        } else {
            tempOptimisticItems = itemsQuery.data.content;
        }

        for (const optimisticItem of tempOptimisticItems) {
            if (optimisticSortItems[optimisticItem.id] !== undefined) {
                optimisticItem.sort = optimisticSortItems[optimisticItem.id];
            }
        }

        tempOptimisticItems.sort((a, b) => a.sort - b.sort);

        return tempOptimisticItems;
    }, [itemsQuery.data, itemsQuery.isSuccess, optimisticSortItems]);

    return [optimisticItems, optimisticSortItems] as const;
};
