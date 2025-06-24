import { useSortDialogItemContext } from "components/common/sort-dialog/sort-dialog-item-context";
import { Button } from "components/ui/button";
import { cn } from "libs/utils/style";
import type { FC } from "react";
import { MdDragHandle } from "react-icons/md";

interface Props {
    isOverlay?: boolean;
}

export const SortDialogDragHandle: FC<Props> = props => {
    const { attributes, listeners, setActivatorNodeRef } = useSortDialogItemContext();

    return (
        <Button
            {...attributes}
            {...listeners}
            ref={setActivatorNodeRef}
            className={cn(
                "text-muted-foreground",
                props.isOverlay && "bg-accent text-accent-foreground dark:bg-accent/50"
            )}
            variant="ghost"
            size="icon"
        >
            <MdDragHandle className="size-3/4" data-vaul-no-drag />
        </Button>
    );
};
