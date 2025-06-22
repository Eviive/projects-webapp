import type { UseMutationResult } from "@tanstack/react-query";
import type { SortDialogContentRef } from "components/common/sort-dialog/sort-dialog-content";
import { SortDialogContext } from "components/common/sort-dialog/sort-dialog-context";
import { DialogDrawer } from "components/ui/dialog-drawer";
import type { FC, ReactNode } from "react";
import { useRef, useState } from "react";
import type { DndItem } from "types/dnd";

interface Props {
    itemsName: string;
    trigger: ReactNode;
    content: ReactNode;
    mutation: UseMutationResult<void, Error, DndItem[]>;
}

export const SortDialog: FC<Props> = props => {
    const [open, setOpen] = useState(false);

    const contentRef = useRef<SortDialogContentRef>(null);

    const handleClose = (open: boolean, resetSort?: boolean) => {
        if (!open && !resetSort) {
            const sorts = contentRef.current?.();

            if (sorts) {
                props.mutation.mutate(sorts);
            }
        }

        setOpen(open);
    };

    return (
        <DialogDrawer
            trigger={props.trigger}
            header={{
                title: `Sorting ${props.itemsName}`,
                description: `Use this list to sort the ${props.itemsName}.`
            }}
            content={
                <SortDialogContext
                    value={{
                        contentRef,
                        handleClose
                    }}
                >
                    {props.content}
                </SortDialogContext>
            }
            open={open}
            onOpenChange={handleClose}
        />
    );
};
