import { formatClassNames } from "libs/utils";
import type { CSSProperties, FC, PropsWithChildren } from "react";

import styles from "./grid.module.scss";

type Props = {
    className?: string;
    minWidth?: string;
    gap?: string;
    columnCount?: number | "infinity";
    centerVertically?: boolean;
    centerHorizontally?: boolean;
};

export const Grid: FC<PropsWithChildren<Props>> = props => {
    return (
        <ul
            className={formatClassNames(styles.layout, props.className)}
            style={{
                "--item-min-width": props.minWidth,
                "--gap": props.gap,
                "--column-count": props.columnCount,
                justifyItems: props.centerHorizontally && "center",
                alignItems: props.centerVertically && "center"
            } as CSSProperties}
        >
            {props.children}
        </ul>
    );
};
