import type { FC, PropsWithChildren, ReactNode } from "react";
import { useEffect, useState } from "react";

type Props = PropsWithChildren<{
    delay?: number;
    fallback?: ReactNode;
}>;

export const Defer: FC<Props> = props => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsReady(true);
        }, props.delay ?? 200);

        return () => {
            clearTimeout(timeout);
        };
    }, [props.delay]);

    return isReady ? props.children : props.fallback;
};
