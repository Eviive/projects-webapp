import type { FC } from "react";
import { ClipLoader } from "react-spinners";

import styles from "./loader.module.scss";

type Props = {
    className?: string;
};

export const Loader: FC<Props> = props => {
    return (
        <div className={props.className ? `${styles.loader} ${props.className}` : styles.loader}>
            <ClipLoader size={75} color="hsl(var(--accent-1))" />
        </div>
    );
};
