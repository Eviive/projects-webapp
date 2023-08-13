import type { UseQueryResult } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { DndItem, DndState } from "types/app";

type useDragAndDropReturnType<T extends DndItem> = {
    items: [ T[], Dispatch<SetStateAction<T[]>> ];
    dndState: DndState;
    handleToggleDnd: () => (void | Promise<void>);
    handleOnSetItems: (items: T[]) => void;
};

export const useDragAndDrop = <T extends DndItem>(
    query: UseQueryResult<T[]>,
    saveOrder: (items: T[]) => (void | Promise<void>)
): useDragAndDropReturnType<T> => {

    const [ items, setItems ] = useState<T[]>(query.data?.sort((a, b) => a.sort - b.sort) ?? []);

    useEffect(() => {
        setItems(query.data?.sort((a, b) => a.sort - b.sort) ?? []);
    }, [ query.data ]);

    const [ dndState, setDndState ] = useState<DndState>({
        isDndActive: false,
        isDndTouched: false,
        isDndSubmitting: false
    });

    const handleToggleDnd = async () => {
        if (dndState.isDndSubmitting) return;
        setDndState(prevDndState => ({ ...prevDndState, isDndSubmitting: true }));

        if (dndState.isDndActive && dndState.isDndTouched) {
            await saveOrder(items);
        }

        setDndState(prevDndState => ({
            ...prevDndState,
            isDndActive: !prevDndState.isDndActive,
            isDndTouched: false,
            isDndSubmitting: false
        }));
    };

    const handleOnSetItems = (items: T[]) => {
        for (const item of query.data ?? []) {
            const newItem = items.find(i => i.id === item.id);
            if (newItem) {
                item.sort = newItem.sort;
            }
        }

        setDndState(prevDndState => ({ ...prevDndState, isDndTouched: true }));
    };

    return {
        items: [ items, setItems ],
        dndState,
        handleToggleDnd,
        handleOnSetItems
    };
};
