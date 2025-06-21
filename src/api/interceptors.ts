import { queryClient } from "api/query-client";
import { UserService } from "api/services/user";
import type { AxiosInstance } from "axios";
import { AxiosError } from "axios";
import { setAuthContext } from "contexts/auth-context";
import { clearAuthContext } from "libs/auth";
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
        if (!isTokenExpired(accessToken)) {
            return req;
        }

        try {
            const refreshRes = await UserService.refresh();

            req.headers.setAuthorization(`Bearer ${refreshRes.accessToken}`);

            setAuthContext(refreshRes);
        } catch (e) {
            console.error("Error while refreshing token:", getDetail(e));
            await clearAuthContext();
            throw e;
        } finally {
            await queryClient.invalidateQueries();
        }

        return req;
    });

    httpClient.interceptors.response.use(
        res => res,
        async err => {
            if (err instanceof AxiosError && err.response?.status === 401) {
                await clearAuthContext();
                await queryClient.invalidateQueries();
            }
            throw err;
        }
    );
};
