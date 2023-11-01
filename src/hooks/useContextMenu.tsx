import { useContextMenuContext } from "contexts/ContextMenuContext";
import type { ContextMenuSection } from "types/context-menu";

export const useContextMenu = () => {

    const { sections, setSections, mouse, setMouse } = useContextMenuContext();

    const addSection = (section: ContextMenuSection) => {
        setSections(prevSections => [ ...prevSections, section ]);
    };

    const closeContextMenu = () => {
        setSections([]);
        setMouse(null);
    };

    return {
        sections,
        addSection,
        closeContextMenu,
        mouse,
        setMouse
    };
};
