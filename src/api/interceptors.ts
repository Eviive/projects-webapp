import { queryClient } from "api/query-client";
import type { AxiosInstance } from "axios";
import { AxiosError } from "axios";
import { clearAuthContext } from "libs/auth/context";

export const initInterceptors = (httpClient: AxiosInstance) => {
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
