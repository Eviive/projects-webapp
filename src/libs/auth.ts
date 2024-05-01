import { UserService } from "api/services/user";
import { getAuthContext, setAuthContext } from "contexts/auth-context";
import { getDetail } from "libs/utils/error";
import { router } from "router";
import type { Authority } from "types/auth";

export const clearAuthContext = async (redirect = true) => {
    await setAuthContext({
        currentUser: await UserService.current(false),
        accessToken: null
    });

    if (!redirect) {
        return;
    }

    await router.navigate("/login", { replace: true });
};

export const initAuthContext = async () => {
    try {
        const refreshRes = await UserService.refresh(false);

        await setAuthContext(refreshRes);
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
