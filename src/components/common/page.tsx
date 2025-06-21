import type { FC, PropsWithChildren } from "react";
import { useEffect } from "react";

type Props = PropsWithChildren<{
    title: string;
}>;

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
