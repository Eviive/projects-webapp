import { FC, ReactNode, useEffect } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

const WINDOW_TITLE = "Dashboard";

export const Page: FC<Props> = ({ title, children }) => {
    useEffect(() => {
        document.title = `${title} - ${WINDOW_TITLE}`;

        return () => {
            document.title = WINDOW_TITLE;
        };
    }, [title]);

    return <>{children}</>;
};
