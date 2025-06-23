import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortDialogItemContext } from "components/common/sort-dialog/sort-dialog-item-context";
import { cn } from "libs/utils/style";
import type { CSSProperties, FC, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    id: UniqueIdentifier;
    isOverlay?: boolean;
}>;

export const SortDialogItem: FC<Props> = props => {
    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition
    } = useSortable({
        id: props.id
    });

    const style: CSSProperties = {
        opacity: isDragging ? 0.4 : undefined,
        transform: CSS.Translate.toString(transform),
        transition
    };

    return (
        <SortDialogItemContext
            value={{
                attributes,
                listeners,
                setActivatorNodeRef
            }}
        >
            <li
                ref={setNodeRef}
                style={style}
                className={cn(
                    "text-ms bg-background flex items-center justify-between gap-3 p-3",
                    props.isOverlay && "shadow-md"
                )}
            >
                {props.children}
            </li>
        </SortDialogItemContext>
    );
};
