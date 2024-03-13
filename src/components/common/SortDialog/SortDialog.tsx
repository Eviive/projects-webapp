import type { UseMutationResult } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "components/ui/dialog";
import { type ReactNode, useRef, useState } from "react";
import type { DndItem, DndSaveItem } from "types/dnd";
import { SortDialogContent, type SortDialogContentRef } from "./SortDialogContent";

type Props<E extends DndItem> = {
    itemsName: string;
    trigger: ReactNode;
    initialItems: E[] | null;
    mutation: UseMutationResult<void, Error, DndSaveItem[]>;
    render: (item: E) => ReactNode;
};

export const SortDialog = <E extends DndItem>(props: Props<E>) => {

    const [ open, setOpen ] = useState(false);

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
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger asChild>{props.trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sorting {props.itemsName}</DialogTitle>
                </DialogHeader>
                {!!props.initialItems && (
                    <SortDialogContent
                        ref={contentRef}
                        initialItems={props.initialItems}
                        render={props.render}
                        closeDialog={resetSort => handleClose(false, resetSort)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
