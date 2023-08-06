import type { FC, ReactNode } from "react";

import styles from "./http-status-card.module.scss";

type Props = {
    name: string;
    code: number;
    icon: ReactNode;
    value: number;
};

export const HttpStatusCard: FC<Props> = props => {
    return (
        <li className={styles.card} style={{ backgroundColor: `var(--status-${props.code})` }}>
            <div className={styles.cardTitle}>
                {props.icon}
                <h1>{`${props.code} ${props.name}`}</h1>
            </div>
            <h2 className={styles.cardValue}>{props.value}</h2>
        </li>
    );
};
