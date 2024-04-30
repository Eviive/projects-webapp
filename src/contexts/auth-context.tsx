import { UserService } from "api/services/user";
import { getDetail } from "libs/utils/error";
import { router } from "router";
import type { CurrentUser } from "types/auth";

type LoggedInAuthContext = {
    currentUser: CurrentUser;
    accessToken: string;
};

type LoggedOutAnonymousAuthContext = {
    currentUser: CurrentUser;
    accessToken: null;
};

type IAuthContext = LoggedInAuthContext | LoggedOutAnonymousAuthContext;

let authContext: IAuthContext | null = null;

export const getAuthContext = (): IAuthContext => {
    if (authContext === null) {
        throw new Error("The authContext has not been initialized");
    }

    return authContext;
};

export const setAuthContext = (newAuthContext: IAuthContext) => {
    authContext = newAuthContext;
};

export const clearAuthContext = async (navigate = true) => {
    setAuthContext({
        currentUser: await UserService.current(),
        accessToken: null
    });

    if (!navigate) {
        window.history.replaceState(null, "", "/login");
        return;
    }

    await router.navigate("/login", { replace: true });
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
