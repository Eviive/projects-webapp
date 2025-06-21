import { SortDialogDragContent } from "components/common/sort-dialog/sort-dialog-drag-content";
import { Button } from "components/ui/button";
import { Defer } from "components/ui/defer";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { DndItem } from "types/dnd";
import type { PropsWithForwardedRef, PropsWithStatus } from "types/utils/props";

export type SortDialogContentRef = () => DndItem[] | null;

type Props<E extends DndItem> = PropsWithStatus<
    PropsWithForwardedRef<
        {
            initialItems?: E[];
            render: (item: E) => ReactNode;
            closeDialog: (resetSort: boolean) => void;
        },
        SortDialogContentRef
    >
>;

export const SortDialogContent = <E extends DndItem>(props: Props<E>) => {
    const [items, setItems] = useState<E[]>();

    useEffect(() => {
        if (!props.initialItems) return;

        setItems(props.initialItems);
    }, [props.initialItems]);

    const shouldDisplayContent =
        items !== undefined &&
        props.empty === false &&
        props.loading === false &&
        props.error === false;

    return (
        <>
            <div className="grid h-[500px] place-items-center">
                {shouldDisplayContent && (
                    <SortDialogDragContent
                        ref={props.ref}
                        items={items}
                        setItems={items => {
                            setItems(prevItems => {
                                if (!prevItems) return prevItems;

                                if (typeof items === "function") {
                                    return items(prevItems);
                                }

                                return items;
                            });
                        }}
                        render={props.render}
                    />
                )}
                {props.empty}
                {props.loading && <Defer>{props.loading}</Defer>}
                {props.error}
            </div>
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => {
                        props.closeDialog(true);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        props.closeDialog(false);
                    }}
                >
                    Save
                </Button>
            </div>
        </>
    );
};
