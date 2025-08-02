import type { Authority } from "types/auth/authorities";
import type { CurrentLoggedInUser, CurrentUser } from "types/auth/user";

export const isLoggedIn = (currentUser: CurrentUser): currentUser is CurrentLoggedInUser => {
    return "email" in currentUser;
};

export const hasEveryAuthority = (
    requiredAuthorities: Authority[],
    currentUser: CurrentUser
): boolean => {
    return requiredAuthorities.every(requiredAuthority =>
        hasAuthority(requiredAuthority, currentUser)
    );
};

export const hasAuthority = (authority: Authority, currentUser: CurrentUser): boolean => {
    return currentUser.authorities.includes(authority);
};
