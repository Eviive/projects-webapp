import { defaultDropAnimationSideEffects, DragOverlay, DropAnimation } from "@dnd-kit/core";
import { FC, PropsWithChildren } from "react";

const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.4"
            }
        }
    })
};

export const SortableOverlay: FC<PropsWithChildren> = props => {
    return (
        <DragOverlay dropAnimation={dropAnimationConfig}>{props.children}</DragOverlay>
    );
};
