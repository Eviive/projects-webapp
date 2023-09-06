import { useSortableItemContext } from "contexts/SortableItemContext";
import type { FC } from "react";
import { RxDragHandleDots2 } from "react-icons/rx";

type Props = {
    className?: string;
    isDragging?: boolean;
};

export const SortableDragHandle: FC<Props> = props => {
    const {
        attributes,
        listeners,
        setActivatorNodeRef
    } = useSortableItemContext();

    return (
        <button
            className={props.className}
            style={{ cursor: props.isDragging ? "grabbing" : "grab" }}
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
        >
            <RxDragHandleDots2 size={25}/>
        </button>
    );
};
