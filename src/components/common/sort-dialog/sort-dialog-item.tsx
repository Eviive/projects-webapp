import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortDialogItemContextProvider } from "components/common/sort-dialog/sort-dialog-item-context";
import { cn } from "libs/utils/style";
import type { CSSProperties, PropsWithChildren } from "react";
import { type FC, useMemo } from "react";

type Props = {
    id: UniqueIdentifier;
    isOverlay?: boolean;
};

export const SortDialogItem: FC<PropsWithChildren<Props>> = props => {
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

    const context = useMemo(
        () => ({
            attributes,
            listeners,
            setActivatorNodeRef
        }),
        [attributes, listeners, setActivatorNodeRef]
    );

    const style: CSSProperties = {
        opacity: isDragging ? 0.4 : undefined,
        transform: CSS.Translate.toString(transform),
        transition
    };

    return (
        <SortDialogItemContextProvider value={context}>
            <li
                ref={setNodeRef}
                style={style}
                className={cn(
                    "text-ms flex items-center justify-between gap-3 bg-background p-3",
                    props.isOverlay && "shadow-md"
                )}
            >
                {props.children}
            </li>
        </SortDialogItemContextProvider>
    );
};
