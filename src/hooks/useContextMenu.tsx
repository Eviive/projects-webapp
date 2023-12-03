import { useContextMenuContext } from "contexts/ContextMenuContext";
import type { MouseEvent } from "react";
import type { ContextMenuSection } from "types/context-menu";

type UseContextMenuOutput = Pick<ReturnType<typeof useContextMenuContext>, "state" | "setState"> & {
    addSection: (e: MouseEvent, section: ContextMenuSection) => void;
    closeContextMenu: () => void;
};

export const useContextMenu = (): UseContextMenuOutput => {

    const { state, setState } = useContextMenuContext();

    const addSection = (e: MouseEvent, section: ContextMenuSection) => {
        e.preventDefault();
        setState(prevState => {
            const prevSections = prevState.status === "open"
                ? prevState.sections
                : [];

            return {
                ...prevState,
                status: "open",
                position: {
                    x: e.pageX,
                    y: e.pageY
                },
                sections: [ ...prevSections, section ]
            };
        });
    };

    const closeContextMenu = () => {
        setState({ status: "closed" });
    };

    return {
        state,
        setState,
        addSection,
        closeContextMenu
    };
};
