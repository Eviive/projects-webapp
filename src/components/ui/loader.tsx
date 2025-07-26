import { Defer } from "components/ui/defer";
import { cn } from "libs/utils/style";
import type { FC } from "react";
import { LuLoaderCircle } from "react-icons/lu";

interface Props {
    className?: string;
    defer?: boolean | number;
}

export const Loader: FC<Props> = props => {
    const loader = (
        <div className="grid grow place-items-center">
            <LuLoaderCircle className={cn("animate-spin", props.className)} />
        </div>
    );

    if (!props.defer) {
        return loader;
    }

    return (
        <Defer delay={typeof props.defer === "number" ? props.defer : undefined}>
            {loader}
        </Defer>
    );
};
