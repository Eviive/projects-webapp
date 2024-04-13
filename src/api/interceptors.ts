import { UserService } from "api/services/user";
import { AxiosError, type AxiosInstance } from "axios";
import { authContext } from "contexts/auth-context";
import { decodeToken, isTokenExpired } from "libs/token";
import { getFormattedTitleAndMessage } from "libs/utils/error";

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

        if (accessToken !== null && !isTokenExpired(accessToken)) {
            req.headers["Authorization"] = `Bearer ${accessToken}`;
            return req;
        }

        console.log("Access token expired, refreshing...");
        try {
            const { accessToken: newAccessToken } = await UserService.refresh();

            const tokenPayload = decodeToken(newAccessToken);

            if (!tokenPayload || !tokenPayload.authorities.includes("ROLE_ADMIN")) {
                setAccessToken(null);
                return Promise.reject(new Error("User is not admin"));
            }

            req.headers["Authorization"] = `Bearer ${newAccessToken}`;
            setAccessToken(newAccessToken);
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
