import type { FC, MouseEventHandler, PropsWithChildren } from "react";
import { PulseLoader } from "react-spinners";
import { formatClassNames } from "utils/components";

import styles from "./button.module.scss";

type Props = {
    className?: string;
    loading?: boolean;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
    round?: boolean;
};

export const Button: FC<PropsWithChildren<Props>> = props => {

    const className = formatClassNames(
        styles.button,
        props.className,
        props.round && styles.round
    );

    return (
        <button
            className={className}
            onClick={props.handleClick}
        >
            { props.loading
                ? <PulseLoader
                    size={props.round ? 5 : 10}
                    color="hsl(var(--primary-1))"
                    cssOverride={{ display: "flex" }}
                />
                : props.children
            }
        </button>
    );
};
