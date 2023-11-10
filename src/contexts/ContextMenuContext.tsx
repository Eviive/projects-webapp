import type { Dispatch, FC, PropsWithChildren, SetStateAction } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { ContextMenuState } from "types/context-menu";

type IContextMenuContext = {
    state: ContextMenuState;
    setState: Dispatch<SetStateAction<ContextMenuState>>;
};

const ContextMenuContext = createContext<IContextMenuContext | null>(null);

export const ContextMenuContextProvider: FC<PropsWithChildren> = ({ children }) => {

    const [ state, setState ] = useState<ContextMenuState>({ status: "closed" });

    const contextMenuContextValue = useMemo<IContextMenuContext>(() => ({
        state,
        setState
    }), [ state, setState ]);

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
