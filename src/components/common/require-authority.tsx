import { useAuthContext } from "contexts/auth-context";
import { hasAuthority, hasEveryAuthority } from "libs/auth";
import type { FC, PropsWithChildren } from "react";
import type { Authority } from "types/auth";

type Props = {
    authority: Authority | Authority[];
};

export const RequireAuthority: FC<PropsWithChildren<Props>> = props => {
    const { currentUser } = useAuthContext();

    if (
        !Array.isArray(props.authority) &&
        !hasAuthority(props.authority, currentUser.authorities)
    ) {
        return null;
    }

    if (
        Array.isArray(props.authority) &&
        !hasEveryAuthority(props.authority, currentUser.authorities)
    ) {
        return null;
    }

    return props.children;
};
