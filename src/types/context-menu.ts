import type { ReactNode } from "react";

type ContextMenuItem = {
    title: string;
    icon: ReactNode;
    handleAction: () => (void | Promise<void>)
    danger?: boolean;
    disabled?: boolean;
};

export type ContextMenuSection = {
    title: string;
    items: ContextMenuItem[];
};

export type ContextMenuState = ContextMenuStateOpen | ContextMenuStateClosed;

type ContextMenuStateOpen = {
    status: "open";
    position: Mouse;
    sections: ContextMenuSection[];
};

type ContextMenuStateClosed = {
    status: "closed";
};

export type Mouse = {
    x: number;
    y: number;
};
