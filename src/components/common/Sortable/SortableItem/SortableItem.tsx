import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableItemContextProvider } from "contexts/SortableItemContext";
import type { CSSProperties, FC, PropsWithChildren } from "react";

type Props = {
    id?: UniqueIdentifier;
    className?: string;
};

export const SortableItem: FC<PropsWithChildren<Props>> = props => {
    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition
    } = useSortable({
        id: props.id ?? "",
        disabled: props.id === undefined
    });

    const style: CSSProperties = {
        opacity: isDragging ? 0.4 : undefined,
        transform: CSS.Translate.toString(transform),
        transition
    };

    return (
        <SortableItemContextProvider value={{
            attributes,
            listeners,
            setActivatorNodeRef
        }}>
            <li ref={setNodeRef} className={props.className} style={style}>
                {props.children}
            </li>
        </SortableItemContextProvider>
    );
};
