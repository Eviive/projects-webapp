import { queryClient } from "api/query-client";
import { MeService } from "api/services/me";
import type { AxiosInstance } from "axios";
import { AxiosError } from "axios";
import type { IAuthContext } from "contexts/auth-context";
import { getOptionalAuthContext, setAuthContext } from "contexts/auth-context";
import { clearAuthContext } from "libs/auth";
import { isTokenExpired } from "libs/token";

export const initInterceptors = (httpClient: AxiosInstance) => {
    httpClient.interceptors.request.use(async req => {
        const authContext = getOptionalAuthContext();

        if (authContext === null) {
            return req;
        }

        const currentUser = authContext.currentUser;

        // TODO: include NON_NULL
        if (!("email" in currentUser)) {
            return req;
        }

        if (!isTokenExpired(currentUser.exp)) {
            return req;
        }

        try {
            const currentUser = await MeService.me();

            const newAuthContext: IAuthContext = {
                currentUser
            };

            setAuthContext(newAuthContext);
        } catch (e) {
            console.error("Error while refreshing token:", e);
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
