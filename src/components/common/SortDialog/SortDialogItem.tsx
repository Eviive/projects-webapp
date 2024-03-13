import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "lib/utils/style";
import type { CSSProperties, PropsWithChildren } from "react";
import { type FC, useMemo } from "react";
import { SortDialogContextProvider } from "./SortDialogContext";

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
        [ attributes, listeners, setActivatorNodeRef ]
    );

    const style: CSSProperties = {
        opacity: isDragging ? 0.4 : undefined,
        transform: CSS.Translate.toString(transform),
        transition
    };

    return (
        <SortDialogContextProvider value={context}>
            <li
                ref={setNodeRef}
                style={style}
                className={cn(
                    "p-3 flex justify-between items-center gap-3 text-ms bg-background",
                    props.isOverlay && "rounded-sm shadow-md bg-white"
                )}
            >
                {props.children}
            </li>
        </SortDialogContextProvider>
    );
};
