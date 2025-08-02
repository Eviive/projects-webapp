import type { UseMutationResult } from "@tanstack/react-query";
import type { SortDialogContentRef } from "components/common/sort-dialog/sort-dialog-content";
import { SortDialogContext } from "components/common/sort-dialog/sort-dialog-context";
import { DialogDrawer } from "components/ui/dialog-drawer";
import { getDetail } from "libs/utils/error";
import { capitalize } from "libs/utils/string";
import type { FC, ReactNode } from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
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

    const handleClose = async (open: boolean, resetSort?: boolean): Promise<void> => {
        try {
            if (!open && !resetSort) {
                const sorts = contentRef.current?.();

                if (sorts) {
                    await props.mutation.mutateAsync(sorts);
                }
            }

            setOpen(open);
        } catch (e) {
            const message = capitalize(props.itemsName) + " sort update failed:";
            toast.error(message + " " + getDetail(e));
            console.error(message, e);
        }
    };

    return (
        <DialogDrawer
            trigger={props.trigger}
            header={{
                title: "Sorting " + props.itemsName,
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
