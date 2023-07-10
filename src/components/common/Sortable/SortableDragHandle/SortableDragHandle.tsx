import { useSortableItemContext } from "contexts/SortableItemContext";
import { FC } from "react";
import { RxDragHandleDots2 } from "react-icons/rx";

type Props = {
    className?: string;
};

export const SortableDragHandle: FC<Props> = props => {
    const {
        attributes,
        listeners,
        setActivatorNodeRef
    } = useSortableItemContext();

    return (
        <button className={props.className} ref={setActivatorNodeRef} {...attributes} {...listeners}>
            <RxDragHandleDots2 size={22}/>
        </button>
    );
};
