import { Button } from "@nextui-org/react";
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
        <>
            <Button
                as="div"
                className={props.className}
                isIconOnly
                size="sm"
            >
                <button
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...listeners}
                    className="w-full h-full grid place-items-center"
                    style={{ cursor: props.isDragging ? "grabbing" : "grab" }}
                >
                    <RxDragHandleDots2 size={25}/>
                </button>
            </Button>
        </>
    );
};
