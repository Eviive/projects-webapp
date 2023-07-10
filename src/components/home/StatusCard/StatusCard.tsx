import { FC, ReactNode } from "react";
import { Status } from "types/health";

import styles from "./status-card.module.scss";

type Props = {
    title: string;
    icon: ReactNode;
    status: Status;
};

const STATUS_COLORS: Record<Status, string> = {
    UP: "hsl(121deg 34% 51%)",
    DOWN: "hsl(355deg, 60%, 52%)",
    OUT_OF_SERVICE: "hsl(21deg, 100%, 50%)",
    UNKNOWN: "hsl(0deg, 0%, 50%)"
};

export const StatusCard: FC<Props> = props => {
    return (
        <li className={styles.card} style={{ backgroundColor: STATUS_COLORS[props.status] }}>
            <h3>{props.title}</h3>
            <div className={styles.cardContent}>
                {props.icon}
                <p>{props.status}</p>
            </div>
        </li>
    );
};
