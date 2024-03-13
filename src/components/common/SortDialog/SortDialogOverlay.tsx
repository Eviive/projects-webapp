import { defaultDropAnimationSideEffects, DragOverlay, type DropAnimation } from "@dnd-kit/core";
import type { FC, PropsWithChildren } from "react";

const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.4"
            }
        }
    })
};

export const SortDialogOverlay: FC<PropsWithChildren> = props => {
    return (
        <DragOverlay
            dropAnimation={dropAnimationConfig}
            transition="unset"
        >
            {props.children}
        </DragOverlay>
    );
};
