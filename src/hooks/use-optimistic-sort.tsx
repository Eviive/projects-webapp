import type {
    InfiniteData,
    MutationKey,
    UseInfiniteQueryResult,
    UseQueryResult
} from "@tanstack/react-query";
import { useMutationState } from "@tanstack/react-query";
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

    const optimisticSortItems: Record<number, number> = {};

    for (const sortItem of optimisticSorts.flat()) {
        optimisticSortItems[sortItem.id] = sortItem.sort;
    }

    let optimisticItems: I[] = [];
    if (itemsQuery.isSuccess) {
        if (Array.isArray(itemsQuery.data)) {
            optimisticItems = [...itemsQuery.data];
        } else if ("pages" in itemsQuery.data) {
            optimisticItems = itemsQuery.data.pages.flatMap(page => page.content);
        } else {
            optimisticItems = itemsQuery.data.content;
        }

        for (const optimisticItem of optimisticItems) {
            if (optimisticItem.id in optimisticSortItems) {
                optimisticItem.sort = optimisticSortItems[optimisticItem.id];
            }
        }

        optimisticItems.sort((a, b) => a.sort - b.sort);
    }

    return [optimisticItems, optimisticSortItems] as const;
};
