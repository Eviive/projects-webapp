import type { Dispatch, FC, PropsWithChildren, SetStateAction } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { FaBoreHole } from "react-icons/fa6";
import type { ContextMenuSection, Mouse } from "types/context-menu";

type IContextMenuContext = {
    sections: ContextMenuSection[];
    setSections: Dispatch<SetStateAction<ContextMenuSection[]>>;
    mouse: Mouse | null;
    setMouse: Dispatch<SetStateAction<Mouse | null>>;
};

const ContextMenuContext = createContext<IContextMenuContext | null>(null);

export const ContextMenuContextProvider: FC<PropsWithChildren> = ({ children }) => {

    const [ sections, setSections ] = useState<ContextMenuSection[]>([ { title: "Test", items: [ { title: "Test", icon: <FaBoreHole size={25} />, handleAction: () => {} } ] } ]);

    const [ mouse, setMouse ] = useState<Mouse | null>(null);

    const contextMenuContextValue = useMemo<IContextMenuContext>(() => ({
        sections,
        setSections,
        mouse,
        setMouse
    }), [ sections, setSections, mouse, setMouse ]);

    return (
        <ContextMenuContext.Provider value={contextMenuContextValue}>
            {children}
        </ContextMenuContext.Provider>
    );
};

export const useContextMenuContext = (): IContextMenuContext => {
    const contextMenuContext = useContext(ContextMenuContext);
    if (contextMenuContext === null) {
        throw new Error("useContextMenuContext called without ContextMenuContextProvider");
    }
    return contextMenuContext;
};
