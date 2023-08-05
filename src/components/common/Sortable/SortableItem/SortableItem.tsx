import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableItemContextProvider } from "contexts/SortableItemContext";
import { ComponentProps, CSSProperties, FC, PropsWithChildren } from "react";

type Props = {
    id?: UniqueIdentifier;
    itemProps?: Omit<ComponentProps<"li">, "children">;
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
            <li ref={setNodeRef} style={style} {...props.itemProps}>
                {props.children}
            </li>
        </SortableItemContextProvider>
    );
};
