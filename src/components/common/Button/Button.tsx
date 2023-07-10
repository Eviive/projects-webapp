import { FC, MouseEventHandler, PropsWithChildren } from "react";
import { PulseLoader } from "react-spinners";

import styles from "./button.module.scss";

type Props = {
    className?: string;
    loading?: boolean;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
};

export const Button: FC<PropsWithChildren<Props>> = props => {
    return (
        <button
            className={props.className ? `${styles.button} ${props.className}` : styles.button}
            onClick={props.handleClick}
        >
            { props.loading
                ? <PulseLoader
                    size={10}
                    color="hsl(var(--primary-1))"
                    cssOverride={{ display: "unset" }}
                />
                : props.children
            }
        </button>
    );
};
