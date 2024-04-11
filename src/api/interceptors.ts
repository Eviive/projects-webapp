import { UserService } from "api/services/user";
import { AxiosError, type AxiosInstance } from "axios";
import { authContext } from "contexts/auth-context";
import { jwtDecode } from "jwt-decode";
import { getFormattedTitleAndMessage } from "libs/utils/error";

const isExpired = (token: string) => {
    try {
        const { exp: expiresAt } = jwtDecode(token);

        return expiresAt && Date.now() >= (expiresAt + 1) * 1000;
    } catch (e) {
        console.error("Error while decoding token", getFormattedTitleAndMessage(e));
        return true;
    }
};

export const initInterceptors = (httpClient: AxiosInstance) => {
    httpClient.interceptors.request.use(async req => {
        if (!req.headers?.["Authorization"]) {
            return req;
        }

        const authHeader = req.headers["Authorization"];

        if (authHeader !== "Bearer ") {
            return req;
        }

        const { accessToken, setAccessToken } = authContext;

        if (accessToken !== null && !isExpired(accessToken)) {
            req.headers["Authorization"] = `Bearer ${accessToken}`;
            return req;
        }

        console.log("Access token expired, refreshing...");
        try {
            const resRefresh = await UserService.refresh();

            if (!resRefresh.roles.includes("ROLE_ADMIN")) {
                setAccessToken(null);
                return Promise.reject(new Error("User is not admin"));
            }

            const newToken = resRefresh.accessToken;
            req.headers["Authorization"] = `Bearer ${newToken}`;
            setAccessToken(newToken);
        } catch (e) {
            console.error("Error while refreshing token", getFormattedTitleAndMessage(e));
            setAccessToken(null);
            return Promise.reject(e);
        }

        return req;
    });

    httpClient.interceptors.response.use(
        res => res,
        async err => {
            if (err instanceof AxiosError && err.response?.status === 401) {
                authContext.setAccessToken(null);
            }
            return Promise.reject(err);
        }
    );
};
