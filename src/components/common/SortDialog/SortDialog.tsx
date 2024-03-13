import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "components/ui/dialog";
import type { ReactNode } from "react";
import { useState } from "react";
import type { DndItem } from "types/dnd";
import { SortDialogContent } from "./SortDialogContent";

type Props<E extends DndItem> = {
    itemsName: string;
    initialItems: E[] | null;
    render: (item: E) => ReactNode;
    trigger: ReactNode;
};

export const SortDialog = <E extends DndItem>(props: Props<E>) => {

    const [ open, setOpen ] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{props.trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sorting {props.itemsName}</DialogTitle>
                </DialogHeader>
                {!!props.initialItems && (
                    <SortDialogContent
                        initialItems={props.initialItems}
                        render={props.render}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
