import type { ReactNode } from "react";
import type { Route } from "types/app";

export type HeaderRouteItem = Route & {
    type: "route";
};

export type HeaderActionItem = {
    type: "action";
    name: string;
    handleAction: () => void | Promise<void>;
};

export type HeaderItem = (HeaderRouteItem | HeaderActionItem) & {
    danger?: boolean;
};

export type HeaderMenuItem = HeaderItem & {
    description: string;
};

export type HeaderMenu = {
    type: "menu";
    name: string;
    description: string;
    icon: ReactNode;
    children: HeaderMenuItem[];
};
