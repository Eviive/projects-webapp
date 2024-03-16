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
        ...size && { "--loader-size": `${size}px` },
        ...color && { "--loader-color": color }
    } as CSSProperties;

    return (
        <div className="grow grid place-items-center">
            <span
                className={cn(
                    styles.loader,
                    "loader rounded-full animate-spin",
                    absolute && "absolute"
                )}
                style={loaderStyle}
            />
        </div>
    );
};
