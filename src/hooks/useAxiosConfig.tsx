import { httpClient } from "api/client";
import decode, { JwtPayload } from "jwt-decode";
import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { UserService } from "../api/services";

const isExpired = (token: string) => {
    const { exp } = decode<JwtPayload>(token);

    return exp && Date.now() >= exp * 1000;
};

export const useAxiosConfig = () => {

    const { accessToken, setAccessToken } = useAuthContext();

    useEffect(() => {
        const requestInterceptor = httpClient.interceptors.request.use(
            async req => {
                if (req.headers?.Authorization) {
                    const authHeader = req.headers.Authorization;

                    if (authHeader === "Bearer ") {
                        if (isExpired(accessToken)) {
                            console.log("Access token expired, refreshing...");
                            try {
                                const resRefresh = await UserService.refresh();

                                if (resRefresh.roles.includes("ROLE_ADMIN")) {
                                    const newToken = resRefresh.accessToken;
                                    req.headers.Authorization = `Bearer ${newToken}`;
                                    setAccessToken(newToken);
                                    return req;
                                }
                            } catch (e) {
                                console.error("Refreshing failed", e);
                                setAccessToken("");
                                // showPopup({
                                //     title: "Session Expired",
                                //     message: "Your session has expired. Please log in again."
                                // });

                                return Promise.reject(e);
                            }
                        } else {
                            req.headers.Authorization = `Bearer ${accessToken}`;
                            return req;
                        }
                    }
                }
                return req;
            },
            err => err
        );

        return () => {
            httpClient.interceptors.request.eject(requestInterceptor);
        };
    }, [ accessToken, setAccessToken ]);
};
