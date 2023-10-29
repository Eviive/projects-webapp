import type { ReactNode } from "react";
import type { Route } from "types/app";

type HeaderRouteItem = Route & {
    type: "route";
};

type HeaderActionItem = {
    name: string;
    type: "action";
    handleAction: () => void | Promise<void>;
};

export type HeaderItem = (HeaderRouteItem | HeaderActionItem);

export type WithIcon<I extends HeaderItem> = I & {
    icon: ReactNode;
    danger?: boolean;
};

export type HeaderMenu = {
    name: string;
    type: "menu";
    children: WithIcon<HeaderItem>[];
};
