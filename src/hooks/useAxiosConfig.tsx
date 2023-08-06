import { httpClient } from "api/client";
import { UserService } from "api/services";
import { AxiosError } from "axios";
import type { JwtPayload } from "jwt-decode";
import decode from "jwt-decode";
import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getTitleAndMessage } from "utils/errors";

const isExpired = (token: string) => {
    const { exp: expiresAt } = decode<JwtPayload>(token);

    return expiresAt && Date.now() >= expiresAt * 1000;
};

export const useAxiosConfig = (accessToken: string, setAccessToken: Dispatch<SetStateAction<string>>) => {
    useEffect(() => {
        const requestInterceptor = httpClient.interceptors.request.use(
            async req => {
                if (!req.headers?.["Authorization"]) {
                    return req;
                }

                const authHeader = req.headers["Authorization"];

                if (authHeader !== "Bearer ") {
                    return req;
                }

                if (!isExpired(accessToken)) {
                    req.headers["Authorization"] = `Bearer ${accessToken}`;
                    return req;
                }

                console.log("Access token expired, refreshing...");
                try {
                    const resRefresh = await UserService.refresh();

                    if (!resRefresh.roles.includes("ROLE_ADMIN")) {
                        setAccessToken("");
                        return Promise.reject("User is not admin");
                    }

                    const newToken = resRefresh.accessToken;
                    req.headers["Authorization"] = `Bearer ${newToken}`;
                    setAccessToken(newToken);
                } catch (e) {
                    console.error("Refreshing failed :", getTitleAndMessage(e));
                    setAccessToken("");
                    return Promise.reject(e);
                }

                return req;
            }
        );

        const responseInterceptor = httpClient.interceptors.response.use(
            res => res,
            async err => {
                if (err instanceof AxiosError && err.response?.status === 401) {
                    setAccessToken("");
                } else {
                    toast.error(getTitleAndMessage(err));
                }
                return Promise.reject(err);
            }
        );

        return () => {
            httpClient.interceptors.request.eject(requestInterceptor);
            httpClient.interceptors.response.eject(responseInterceptor);
        };
    }, [ accessToken, setAccessToken ]);
};
