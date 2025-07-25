import { MeService } from "api/services/me";
import type { IAuthContext } from "contexts/auth-context";
import { setAuthContext } from "contexts/auth-context";
import { router } from "router";
import type { Authority, CurrentUser } from "types/auth";

export const clearAuthContext = async (redirect = true): Promise<IAuthContext> => {
    const currentUser = await MeService.me();

    const newAuthContext: IAuthContext = {
        currentUser
    };

    setAuthContext(newAuthContext);

    if (redirect) {
        await router.navigate("/login", { replace: true });
    }

    return newAuthContext;
};

export const initAuthContext = async () => {
    const currentUser = await MeService.me();

    const newAuthContext: IAuthContext = {
        currentUser
    };

    setAuthContext(newAuthContext);
};

export const isLoggedIn = (currentUser: CurrentUser) => {
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
