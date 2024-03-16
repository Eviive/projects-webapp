import { useSortDialogContext } from "components/common/sort-dialog/sort-dialog-context";
import { Button } from "components/ui/button";
import type { FC } from "react";
import { MdDragHandle } from "react-icons/md";

export const SortDialogDragHandle: FC = () => {

    const {
        attributes,
        listeners,
        setActivatorNodeRef
    } = useSortDialogContext();

    return (
        <Button
            {...attributes}
            {...listeners}
            ref={setActivatorNodeRef}
            className="text-foreground-500 h-8 w-8"
            variant="ghost"
            size="icon"
        >
            <MdDragHandle size={30} />
        </Button>
    );
};
