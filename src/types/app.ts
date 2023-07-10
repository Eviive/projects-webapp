import { ReactNode } from "react";

export type Route = {
    path: string;
    name: string;
    icon: ReactNode;
};

export type Falsy = false | 0 | "" | null | undefined;

export type DndState = {
    isDndActive: boolean;
    madeDndChanges: boolean;
    isDndSubmitting: boolean;
};
