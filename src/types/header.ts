import type { ReactNode } from "react";

export type HeaderType = "sidebar" | "header";

export interface HeaderTypeProps {
    type: HeaderType;
}

export type HeaderItemProps = HeaderTypeProps & {
    title: string;
    icon: ReactNode;
};
