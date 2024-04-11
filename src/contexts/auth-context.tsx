import { UserService } from "api/services/user";
import { getFormattedTitleAndMessage } from "libs/utils/error";
import { router } from "router";

type IAuthContext = {
    accessToken: string | null;
    setAccessToken: (accessToken: string | null) => void;
};

export const authContext: IAuthContext = {
    accessToken: null,
    setAccessToken: accessToken => {
        authContext.accessToken = accessToken;

        if (accessToken === null) {
            router.navigate("/login", { replace: true }).catch(console.error);
        }
    }
};

export const initAuthContext = async () => {
    try {
        const res = await UserService.refresh(false);

        if (res.roles.includes("ROLE_ADMIN")) {
            authContext.setAccessToken(res.accessToken);
        }
    } catch (e) {
        console.error("Persistent login failed", getFormattedTitleAndMessage(e));
    }
};
