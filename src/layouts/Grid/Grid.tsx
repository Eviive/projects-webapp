import { CSSProperties, FC, ReactNode } from "react";

import styles from "./grid.module.scss";

type Props = {
    className?: string;
    gap?: string;
    size?: string;
    children: ReactNode;
};

export const Grid: FC<Props> = props => {
    return (
        <div
            className={props.className ? `${styles.layout} ${props.className}` : styles.layout}
            style={{
                "--size": props.size,
                "--gap": props.gap
            } as CSSProperties}
        >
            {props.children}
        </div>
    );
};
