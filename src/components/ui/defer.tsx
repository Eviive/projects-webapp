import { type FC, type PropsWithChildren, useEffect, useState } from "react";

type Props = {
    delay?: number;
};

export const Defer: FC<PropsWithChildren<Props>> = props => {
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
