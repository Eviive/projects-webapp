import { FC, ReactNode, useEffect } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

export const Page: FC<Props> = ({ title, children }) => {
    useEffect(() => {
        document.title = title;

        return () => {
            document.title = "Dashboard";
        };
    }, [title]);

    return <>{children}</>;
};
