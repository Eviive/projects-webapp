import { Defer } from "components/ui/defer";
import type { FC } from "react";
import { LuLoaderCircle } from "react-icons/lu";

interface Props {
    defer?: boolean | number;
}

export const Loader: FC<Props> = props => {
    const loader = (
        <div className="grid grow place-items-center">
            <LuLoaderCircle className="animate-spin min-w-7 min-h-7" />
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
