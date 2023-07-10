import { Active, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { SortableOverlay } from "components/common";
import { GridLayout } from "layouts";
import { ComponentProps, Dispatch, Fragment, ReactNode, SetStateAction, useMemo, useState } from "react";

type BaseItem = {
    id: UniqueIdentifier;
    sort: number;
};

type Props<T extends BaseItem> = {
    items: T[];
    setItems: Dispatch<SetStateAction<T[]>>;
    onSetItems?: (items: T[]) => void;
    renderItem: (t: T) => ReactNode;
    wrapperProps?: Omit<ComponentProps<typeof GridLayout>, "children">;
};

export const SortableList = <T extends BaseItem>(props: Props<T>) => {

    const [ active, setActive ] = useState<Active | null>(null);

    const activeItem = useMemo(
        () => props.items.find(item => item.id === active?.id),
        [ active, props.items ]
    );

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;

        if (over && active.id !== over?.id) {
            props.setItems(prevItems => {
                const activeIndex = prevItems.findIndex(item => item.id === active.id);
                const overIndex = prevItems.findIndex(item => item.id === over.id);

                const newItems: T[] = arrayMove(prevItems, activeIndex, overIndex)
                    .map((item, index) => ({ ...item, sort: index + 1 }));

                props.onSetItems?.(newItems);

                return newItems;
            });
        }

        setActive(null);
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={({ active }) => setActive(active)}
            onDragCancel={() => setActive(null)}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={props.items}>
                <GridLayout {...props.wrapperProps}>
                    {props.items.map(item => <Fragment key={item.id}>{props.renderItem(item)}</Fragment>)}
                </GridLayout>
            </SortableContext>
            <SortableOverlay>
                {activeItem ? props.renderItem(activeItem) : null}
            </SortableOverlay>
        </DndContext>
    );
};
