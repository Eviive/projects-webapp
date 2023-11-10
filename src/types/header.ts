import type { ReactNode } from "react";
import type { Route } from "types/app";

type HeaderRouteItem = Route & {
    type: "route";
};

type HeaderActionItem = {
    name: string;
    type: "action";
    handleAction: () => (void | Promise<void>);
};

export type HeaderItem = (HeaderRouteItem | HeaderActionItem) & {
    danger?: boolean;
};

export type WithMenuAttributes<I extends HeaderItem> = I & {
    icon: ReactNode;
};

export type HeaderMenu = {
    name: string;
    type: "menu";
    children: WithMenuAttributes<HeaderItem>[];
};
