import { UserService } from "api/services/user";
import { AxiosError, type AxiosInstance } from "axios";
import { authContext } from "contexts/auth-context";
import { decodeToken, isTokenExpired } from "libs/token";
import { getDetail } from "libs/utils/error";

export const initInterceptors = (httpClient: AxiosInstance) => {
    httpClient.interceptors.request.use(async req => {
        if (!req.headers.hasAuthorization()) {
            return req;
        }

        const authHeaderMatch = req.headers.getAuthorization(/^Bearer (.+)$/);
        if (authHeaderMatch === null) {
            return req;
        }

        const accessToken = authHeaderMatch[1];
        if (accessToken !== null && !isTokenExpired(accessToken)) {
            return req;
        }

        console.log("Access token expired, refreshing...");

        const { setAccessToken } = authContext;
        try {
            const { accessToken: newAccessToken } = await UserService.refresh();

            const tokenPayload = decodeToken(newAccessToken);

            if (!tokenPayload || !tokenPayload.authorities.includes("ROLE_ADMIN")) {
                setAccessToken(null);
                return Promise.reject(new Error("User is not an admin"));
            }

            req.headers.setAuthorization(`Bearer ${newAccessToken}`);
            setAccessToken(newAccessToken);
        } catch (e) {
            console.error("Error while refreshing token:", getDetail(e));
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
