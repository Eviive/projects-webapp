import { UserService } from "api/services/user";
import { getDetail } from "libs/utils/error";
import { router } from "router";
import type { CurrentUser } from "types/auth";

type LoggedInAuthContext = {
    currentUser: CurrentUser;
    accessToken: string;
};

type AnonymousAuthContext = {
    currentUser: CurrentUser;
    accessToken: null;
};

type LoggedOutAuthContext = {
    currentUser: null;
    accessToken: null;
};

type IAuthContext = LoggedInAuthContext | AnonymousAuthContext | LoggedOutAuthContext;

export const authContext: IAuthContext = {
    currentUser: null,
    accessToken: null
};

export const setAuthContext = (newAuthContext: IAuthContext) => {
    Object.assign(authContext, newAuthContext);

    if (authContext.accessToken === null) {
        router
            .navigate("/login", { replace: true })
            .catch(e => console.error("Failed to navigate to /login:", getDetail(e)));
    }
};

export const clearAuthContext = () => {
    setAuthContext({
        currentUser: null,
        accessToken: null
    });
};

export const initAuthContext = async () => {
    try {
        const refreshRes = await UserService.refresh(false);

        setAuthContext(refreshRes);
    } catch (e) {
        console.error("Persistent login failed:", getDetail(e));
    }
};
