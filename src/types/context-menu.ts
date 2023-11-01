import type { ReactNode } from "react";

type ContextMenuItem = {
    title: string;
    icon: ReactNode;
    handleAction: () => void;
    visible?: boolean;
};

export type ContextMenuSection = {
    title: string;
    items: ContextMenuItem[];
};

export type Mouse = {
    x: number;
    y: number;
};
