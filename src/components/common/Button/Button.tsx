import { formatClassNames } from "libs/utils";
import type { FC, MouseEventHandler, PropsWithChildren } from "react";
import { PulseLoader } from "react-spinners";

import styles from "./button.module.scss";

type Props = {
    className?: string;
    loading?: boolean;
    disabled?: boolean;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
    round?: boolean;
};

export const Button: FC<PropsWithChildren<Props>> = props => {

    const className = formatClassNames(
        styles.button,
        props.className,
        props.disabled && styles.disabled,
        props.round && styles.round
    );

    return (
        <button
            className={className}
            onClick={props.handleClick}
            disabled={props.disabled}
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
