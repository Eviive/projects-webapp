import { UserService } from "api/services/user";
import type { AxiosInstance } from "axios";
import { AxiosError } from "axios";
import { clearAuthContext, setAuthContext } from "contexts/auth-context";
import { isTokenExpired } from "libs/token";
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

        try {
            const refreshRes = await UserService.refresh();

            req.headers.setAuthorization(`Bearer ${refreshRes.accessToken}`);

            setAuthContext(refreshRes);
        } catch (e) {
            console.error("Error while refreshing token:", getDetail(e));
            clearAuthContext();
            return Promise.reject(e);
        }

        return req;
    });

    httpClient.interceptors.response.use(
        res => res,
        async err => {
            if (err instanceof AxiosError && err.response?.status === 401) {
                clearAuthContext();
            }
            return Promise.reject(err);
        }
    );
};
