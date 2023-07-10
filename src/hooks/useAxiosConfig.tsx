import { httpClient } from "api/client";
import { UserService } from "api/services";
import decode, { JwtPayload } from "jwt-decode";
import { Dispatch, SetStateAction, useEffect } from "react";
import { getTitleAndMessage } from "utils/errors";

const isExpired = (token: string) => {
    const { exp } = decode<JwtPayload>(token);

    return exp && Date.now() >= exp * 1000;
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

                if (isExpired(accessToken)) {
                    console.log("Access token expired, refreshing...");
                    try {
                        const resRefresh = await UserService.refresh();

                        if (resRefresh.roles.includes("ROLE_ADMIN")) {
                            const newToken = resRefresh.accessToken;
                            req.headers["Authorization"] = `Bearer ${newToken}`;
                            setAccessToken(newToken);
                            return req;
                        } else {
                            setAccessToken("");
                            return Promise.reject("User is not admin");
                        }
                    } catch (e) {
                        console.error("Refreshing failed :", getTitleAndMessage(e));
                        setAccessToken("");
                        return Promise.reject(e);
                    }
                }

                req.headers["Authorization"] = `Bearer ${accessToken}`;
                return req;
            },
            err => err
        );

        return () => {
            httpClient.interceptors.request.eject(requestInterceptor);
        };
    }, [ accessToken, setAccessToken ]);
};
