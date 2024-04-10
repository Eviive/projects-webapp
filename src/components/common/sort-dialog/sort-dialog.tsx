import type { UseMutationResult } from "@tanstack/react-query";
import {
    SortDialogContent,
    type SortDialogContentRef
} from "components/common/sort-dialog/sort-dialog-content";
import { ResponsiveDrawerDialog } from "components/ui/responsive-drawer-dialog";
import { type ReactNode, useRef, useState } from "react";
import type { DndItem } from "types/dnd";

type Props<E extends DndItem> = {
    itemsName: string;
    trigger: ReactNode;
    initialItems: E[] | null;
    mutation: UseMutationResult<void, Error, DndItem[]>;
    render: (item: E) => ReactNode;
};

export const SortDialog = <E extends DndItem>(props: Props<E>) => {
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
        <ResponsiveDrawerDialog
            trigger={props.trigger}
            header={{
                title: `Sorting ${props.itemsName}`
            }}
            content={
                !!props.initialItems && (
                    <SortDialogContent
                        ref={contentRef}
                        initialItems={props.initialItems}
                        render={props.render}
                        closeDialog={resetSort => handleClose(false, resetSort)}
                    />
                )
            }
            open={open}
            onOpenChange={handleClose}
        />
    );
};
