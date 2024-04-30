import { getAuthContext } from "contexts/auth-context";
import type { Authority } from "types/auth";

export const hasEveryAuthority = (
    requiredAuthorities: Authority[],
    authorities: Authority[] = getAuthorities()
): boolean => {
    return requiredAuthorities.every(requiredAuthority =>
        hasAuthority(requiredAuthority, authorities)
    );
};

export const hasAuthority = (
    authority: Authority,
    authorities: Authority[] = getAuthorities()
): boolean => {
    return authorities.includes(authority);
};

const getAuthorities = (): Authority[] => {
    return getAuthContext().currentUser.authorities;
};
