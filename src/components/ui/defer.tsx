import type { FC, PropsWithChildren } from "react";
import { useEffect, useState } from "react";

type Props = PropsWithChildren<{
    delay?: number;
}>;

export const Defer: FC<Props> = props => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsReady(true);
        }, props.delay ?? 150);

        return () => {
            clearTimeout(timeout);
        };
    }, [props.delay]);

    return isReady ? props.children : null;
};
