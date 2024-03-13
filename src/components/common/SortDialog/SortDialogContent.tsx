import type { Active } from "@dnd-kit/core";
import { DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortDialogDragHandle } from "components/common/SortDialog/SortDialogDragHandle";
import { ScrollArea } from "components/ui/scroll-area";
import { Separator } from "components/ui/separator";
import { Fragment, type ReactNode, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { DndItem } from "types/dnd";
import { SortDialogItem } from "./SortDialogItem";
import { SortDialogOverlay } from "./SortDialogOverlay";

type Props<E extends DndItem> = {
    initialItems: E[];
    render: (item: E) => ReactNode;
};

export const SortDialogContent = <E extends DndItem>(props: Props<E>) => {

    const [ items, setItems ] = useState(props.initialItems);

    const [ active, setActive ] = useState<Active | null>(null);

    const activeItem = useMemo(
        () => items.find(item => item.id === active?.id),
        [ active, items ]
    );

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;

        if (over && active.id !== over.id) {
            setItems(prevItems => {
                const activeIndex = prevItems.findIndex(item => item.id === active.id);
                const overIndex = prevItems.findIndex(item => item.id === over.id);

                const newItems = arrayMove(prevItems, activeIndex, overIndex);

                const movedItems = newItems.slice(Math.min(activeIndex, overIndex), Math.max(activeIndex, overIndex) + 1);

                movedItems
                    .map(item => item.sort)
                    .sort((a, b) => a - b)
                    .forEach((sort, i) => {
                        movedItems[i].sort = sort;
                    });

                return newItems;
            });
        }

        setActive(null);
    };

    return (
        <DndContext
            sensors={sensors}
            modifiers={[ restrictToVerticalAxis, restrictToFirstScrollableAncestor ]}
            onDragStart={({ active }) => setActive(active)}
            onDragCancel={() => setActive(null)}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <ScrollArea className="h-[500px]">
                    <ul className="mr-[calc(var(--scrollbar-size)*1.5)]">
                        {items.map((item, i) => (
                            <Fragment key={item.id}>
                                <SortDialogItem id={item.id}>
                                    {props.render(item)}
                                    <SortDialogDragHandle />
                                </SortDialogItem>
                                {i < items.length - 1 && (
                                    <Separator />
                                )}
                            </Fragment>
                        ))}
                    </ul>
                </ScrollArea>
            </SortableContext>
            {createPortal(
                <SortDialogOverlay>
                    {!!activeItem && (
                        <SortDialogItem id={activeItem.id} isOverlay>
                            {props.render(activeItem)}
                            <SortDialogDragHandle />
                        </SortDialogItem>
                    )}
                </SortDialogOverlay>,
                document.body
            )}
        </DndContext>
    );
};
