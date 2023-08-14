import { useSortableItemContext } from "contexts/SortableItemContext";
import { formatClassNames } from "libs/utils";
import type { FC } from "react";
import { RxDragHandleDots2 } from "react-icons/rx";

import styles from "./sortable-drag-handle.module.scss";

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
        <button
            className={formatClassNames(styles.dragHandle, props.className)}
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
        >
            <RxDragHandleDots2 size={25}/>
        </button>
    );
};
