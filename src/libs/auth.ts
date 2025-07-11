import { UserService } from "api/services/user";
import type { IAuthContext } from "contexts/auth-context";
import { getAuthContext, setAuthContext } from "contexts/auth-context";
import { router } from "router";
import type { Authority } from "types/auth";

export const clearAuthContext = async (redirect = true): Promise<IAuthContext> => {
    const currentUser = await UserService.current(false);

    if (currentUser.id === null) {
        currentUser.username = "Guest";
    }

    const newAuthContext: IAuthContext = {
        currentUser,
        accessToken: null
    };

    setAuthContext(newAuthContext);

    if (redirect) {
        await router.navigate("/login", { replace: true });
    }

    return newAuthContext;
};

export const initAuthContext = async () => {
    try {
        const refreshRes = await UserService.refresh();

        setAuthContext(refreshRes);
    } catch {
        await clearAuthContext(false);
    }
};

const getAuthorities = (): Authority[] => {
    return getAuthContext().currentUser.authorities;
};

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
