import styles from "layouts/grid.module.css";
import { cn } from "libs/utils/style";
import type { CSSProperties, FC, PropsWithChildren } from "react";

interface Props {
    className?: string;
    minWidth?: string;
    gap?: string;
    columnCount?: number;
    centerVertically?: boolean;
    centerHorizontally?: boolean;
}

export const Grid: FC<PropsWithChildren<Props>> = props => {
    return (
        <ul
            className={cn(styles.layout, props.className)}
            style={
                {
                    "--item-min-width": props.minWidth,
                    "--gap": props.gap,
                    "--column-count": props.columnCount,
                    justifyItems: props.centerHorizontally ? "center" : undefined,
                    alignItems: props.centerVertically ? "center" : undefined
                } as CSSProperties
            }
        >
            {props.children}
        </ul>
    );
};
