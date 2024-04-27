import { Defer } from "components/ui/defer";
import { cn } from "libs/utils/style";
import type { CSSProperties, FC } from "react";

import styles from "./loader.module.scss";

type Props = {
    size?: number;
    color?: string;
    absolute?: boolean;
    deferred?: boolean | number;
};

export const Loader: FC<Props> = ({ size, color, absolute, deferred }) => {
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

    return deferred ? (
        <Defer delay={typeof deferred === "number" ? deferred : undefined}>{loader}</Defer>
    ) : (
        loader
    );
};
