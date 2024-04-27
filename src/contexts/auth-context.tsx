import { UserService } from "api/services/user";
import { decodeToken } from "libs/token";
import { getDetail } from "libs/utils/error";
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
            router
                .navigate("/login", { replace: true })
                .catch(e => console.error("Failed to navigate to /login:", getDetail(e)));
        }
    }
};

export const initAuthContext = async () => {
    try {
        const { accessToken } = await UserService.refresh(false);

        const tokenPayload = decodeToken(accessToken);

        if (tokenPayload?.authorities.includes("ROLE_ADMIN")) {
            authContext.setAccessToken(accessToken);
        }
    } catch (e) {
        console.error("Persistent login failed:", getDetail(e));
    }
};
