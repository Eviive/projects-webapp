import { initInterceptors } from "api/interceptors";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { authContext } from "contexts/auth-context";
import { getDetail } from "libs/utils/error";
import { toast } from "sonner";

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

initInterceptors(httpClient);

type RequestConfig<D> = AxiosRequestConfig<D> & {
    needsAuth?: boolean;
    showErrorToast?: boolean;
};

export const request = async <T = void, D = undefined>(url: string, config?: RequestConfig<D>) => {
    const {
        method = "GET",
        data,
        headers,
        needsAuth = true,
        showErrorToast = true,
        ...restConfig
    } = config ?? {};

    const { accessToken } = authContext;
    if (needsAuth && accessToken === null) {
        toast.error("You need to login before accessing this page.");
        throw new Error("No access token found");
    }

    let res: AxiosResponse<T, D>;
    try {
        res = await httpClient.request<T, AxiosResponse<T, D>, D>({
            url,
            method,
            data,
            headers: {
                ...(data && { "Content-Type": "application/json" }),
                ...headers,
                ...(accessToken !== null && { Authorization: `Bearer ${accessToken}` })
            },
            ...restConfig
        });
    } catch (e) {
        showErrorToast && toast.error(getDetail(e));
        throw e;
    }

    return res.data;
};
