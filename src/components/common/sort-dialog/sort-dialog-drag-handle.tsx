import { useSortDialogItemContext } from "components/common/sort-dialog/sort-dialog-item-context";
import { Button } from "components/ui/button";
import type { FC } from "react";
import { MdDragHandle } from "react-icons/md";

export const SortDialogDragHandle: FC = () => {
    const { attributes, listeners, setActivatorNodeRef } = useSortDialogItemContext();

    return (
        <Button
            {...attributes}
            {...listeners}
            ref={setActivatorNodeRef}
            className="text-foreground-500 size-8"
            variant="ghost"
            size="icon"
        >
            <MdDragHandle className="h-full w-full" data-vaul-no-drag />
        </Button>
    );
};
