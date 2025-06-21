import { Defer } from "components/ui/defer";
import { cn } from "libs/utils/style";
import type { CSSProperties, FC } from "react";

import styles from "./loader.module.scss";

interface Props {
    size?: number;
    color?: string;
    absolute?: boolean;
    defer?: boolean | number;
}

export const Loader: FC<Props> = ({ size, color, absolute, defer }) => {
    const loaderStyle = {
        ...(size && { "--loader-size": `${size}px` }),
        ...(color && { "--loader-color": color })
    } as CSSProperties;

    const loader = (
        <div className="grid grow place-items-center">
            <span
                className={cn(
                    styles.loader,
                    "loader animate-spin rounded-full",
                    absolute && "absolute"
                )}
                style={loaderStyle}
            />
        </div>
    );

    return defer ? (
        <Defer delay={typeof defer === "number" ? defer : undefined}>{loader}</Defer>
    ) : (
        loader
    );
};
