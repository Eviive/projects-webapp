import type { Active } from "@dnd-kit/core";
import {
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { SortDialogDragHandle } from "components/common/sort-dialog/sort-dialog-drag-handle";
import { SortDialogItem } from "components/common/sort-dialog/sort-dialog-item";
import { SortDialogOverlay } from "components/common/sort-dialog/sort-dialog-overlay";
import { Button } from "components/ui/button";
import { ScrollArea } from "components/ui/scroll-area";
import { Separator } from "components/ui/separator";
import {
    type ForwardedRef,
    forwardRef,
    Fragment,
    type PropsWithoutRef,
    type ReactNode,
    type RefAttributes,
    useImperativeHandle,
    useMemo,
    useState
} from "react";
import { createPortal } from "react-dom";
import type { DndItem } from "types/dnd";

export type SortDialogContentRef = () => DndItem[] | null;

type Props<E extends DndItem> = {
    initialItems: E[];
    render: (item: E) => ReactNode;
    closeDialog: (resetSort: boolean) => void;
};

const SortDialogContent = <E extends DndItem>(
    props: Props<E>,
    ref: ForwardedRef<SortDialogContentRef>
) => {
    const [items, setItems] = useState(props.initialItems);

    const [initialSort] = useState(props.initialItems.map(item => item.sort));

    useImperativeHandle(
        ref,
        () => {
            return () => {
                const firstMovedIndex = items.findIndex((item, i) => item.sort !== initialSort[i]);
                const lastMovedItem =
                    firstMovedIndex !== -1
                        ? items.findLastIndex((item, i) => item.sort !== initialSort[i])
                        : -1;

                if (firstMovedIndex === -1 || lastMovedItem === -1) return null;

                const movedItems = items.slice(firstMovedIndex, lastMovedItem + 1);

                const sorts = movedItems.map(item => item.sort).sort((a, b) => a - b);

                return movedItems.map((item, i) => ({
                    id: item.id,
                    sort: sorts[i]
                }));
            };
        },
        [initialSort, items]
    );

    const [active, setActive] = useState<Active | null>(null);

    const activeItem = useMemo(() => items.find(item => item.id === active?.id), [active, items]);

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

                return arrayMove(prevItems, activeIndex, overIndex);
            });
        }

        setActive(null);
    };

    return (
        <>
            <DndContext
                sensors={sensors}
                modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
                onDragStart={({ active }) => setActive(active)}
                onDragCancel={() => setActive(null)}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <ScrollArea className="h-[500px]">
                        <ul className="mr-[calc(var(--scrollbar-size)*1.5)]">
                            {items.map((item, i) => (
                                <Fragment key={item.id}>
                                    <Separator />
                                    <SortDialogItem id={item.id}>
                                        {props.render(item)}
                                        <SortDialogDragHandle />
                                    </SortDialogItem>
                                    {i === items.length - 1 && <Separator />}
                                </Fragment>
                            ))}
                        </ul>
                    </ScrollArea>
                </SortableContext>
                {createPortal(
                    <SortDialogOverlay>
                        {!!activeItem && (
                            <>
                                <Separator />
                                <SortDialogItem id={activeItem.id} isOverlay>
                                    {props.render(activeItem)}
                                    <SortDialogDragHandle />
                                </SortDialogItem>
                                <Separator />
                            </>
                        )}
                    </SortDialogOverlay>,
                    document.body
                )}
            </DndContext>
            <div className="flex justify-between">
                <Button variant="outline" onClick={() => props.closeDialog(true)}>
                    Cancel
                </Button>
                <Button onClick={() => props.closeDialog(false)}>Save</Button>
            </div>
        </>
    );
};

const SortDialogContentWithForwardedRef = forwardRef(SortDialogContent) as <E extends DndItem>(
    props: PropsWithoutRef<Props<E>> & RefAttributes<SortDialogContentRef>
) => ReactNode;

export { SortDialogContentWithForwardedRef as SortDialogContent };
