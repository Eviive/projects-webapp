import { MeService } from "api/services/me";
import type { IAuthContext } from "contexts/auth-context";
import { setAuthContext } from "contexts/auth-context";
import { router } from "router";

export const initAuthContext = async (): Promise<void> => {
    const currentUser = await MeService.findMe();

    const newAuthContext: IAuthContext = {
        currentUser
    };

    setAuthContext(newAuthContext);
};

export const clearAuthContext = async (redirect = true): Promise<IAuthContext> => {
    const currentUser = await MeService.findMe();

    const newAuthContext: IAuthContext = {
        currentUser
    };

    setAuthContext(newAuthContext);

    if (redirect) {
        await router.navigate("/login", { replace: true });
    }

    return newAuthContext;
};
