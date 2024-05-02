import { useAuthContext } from "contexts/auth-context";
import { hasAuthority } from "libs/auth";
import type { FC, PropsWithChildren } from "react";
import type { Authority } from "types/auth";

type Props = {
    authority: Authority;
};

export const RequireAuthority: FC<PropsWithChildren<Props>> = props => {
    const { currentUser } = useAuthContext();

    if (!hasAuthority(props.authority, currentUser.authorities)) {
        return null;
    }

    return props.children;
};
