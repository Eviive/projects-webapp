import { FC, ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

export const Page: FC<Props> = ({ title, children }) => {
    document.title = title;

    return <>{children}</>;
};
