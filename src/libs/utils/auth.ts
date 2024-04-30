import type { Authority } from "types/auth";

export const hasEveryAuthority = (
    authorities: Authority[],
    ...requiredAuthorities: Authority[]
): boolean => {
    return requiredAuthorities.every(requiredAuthority =>
        hasAuthority(authorities, requiredAuthority)
    );
};

export const hasAuthority = (authorities: Authority[], authority: Authority): boolean => {
    return authorities.includes(authority);
};
