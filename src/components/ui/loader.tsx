import { cn } from "lib/utils/style";
import type { CSSProperties, FC } from "react";

import styles from "./loader.module.scss";

type Props = {
    size?: number;
    color?: string;
    absolute?: boolean;
};

export const Loader: FC<Props> = ({ size, color, absolute }) => {
    const loaderStyle = {
        ...(size && { "--loader-size": `${size}px` }),
        ...(color && { "--loader-color": color })
    } as CSSProperties;

    return (
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
};
