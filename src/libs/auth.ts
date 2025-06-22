import { UserService } from "api/services/user";
import { getAuthContext, setAuthContext } from "contexts/auth-context";
import type { IAuthContext } from "contexts/auth-context";
import { getDetail } from "libs/utils/error";
import { router } from "router";
import type { Authority } from "types/auth";

export const clearAuthContext = async (redirect = true): Promise<IAuthContext> => {
    const newAuthContext = {
        currentUser: await UserService.current(false),
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
        const refreshRes = await UserService.refresh(false);

        setAuthContext(refreshRes);
    } catch (e) {
        console.error("Persistent login failed:", getDetail(e));
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
