import { formatClassNames } from "libs/utils";
import type { CSSProperties, FC, PropsWithChildren } from "react";

import styles from "./grid.module.scss";

type Props = {
    className?: string;
    gap?: string;
    size?: string;
};

export const Grid: FC<PropsWithChildren<Props>> = props => {
    return (
        <ul
            className={formatClassNames(styles.layout, props.className)}
            style={{
                "--size": props.size,
                "--gap": props.gap
            } as CSSProperties}
        >
            {props.children}
        </ul>
    );
};
