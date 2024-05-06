import type { ReactNode } from "react";

export type HeaderType = "sidebar" | "header";

export type HeaderTypeProps = {
    type: HeaderType;
};

export type HeaderItemProps = HeaderTypeProps & {
    title: string;
    icon: ReactNode;
};
