import { hasAuthority } from "libs/auth";
import type { FC, PropsWithChildren } from "react";
import type { Authority } from "types/auth";

type Props = {
    authority: Authority;
};

export const RequireAuthority: FC<PropsWithChildren<Props>> = props => {
    if (!hasAuthority(props.authority)) {
        return null;
    }

    return props.children;
};
