import { initInterceptors } from "api/interceptors";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { getAuthContext } from "contexts/auth-context";
import { hasEveryAuthority } from "libs/utils/auth";
import { getDetail } from "libs/utils/error";
import { toast } from "sonner";
import type { Authority } from "types/auth";

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

initInterceptors(httpClient);

type RequestConfig<D> = AxiosRequestConfig<D> & {
    requiredAuthorities?: Authority[];
    showErrorToast?: boolean;
};

export const request = async <T = void, D = undefined>(url: string, config?: RequestConfig<D>) => {
    const {
        method = "GET",
        data,
        headers,
        requiredAuthorities,
        showErrorToast = true,
        ...restConfig
    } = config ?? {};

    if (requiredAuthorities !== undefined && !hasEveryAuthority(requiredAuthorities)) {
        const message = "You do not have the required authorities to perform this action.";
        toast.error(message);
        throw new Error(message);
    }

    const accessToken = requiredAuthorities !== undefined ? getAuthContext().accessToken : null;

    let res: AxiosResponse<T, D>;
    try {
        res = await httpClient.request<T, AxiosResponse<T, D>, D>({
            url,
            method,
            data,
            headers: {
                ...(data && { "Content-Type": "application/json" }),
                ...headers,
                ...(accessToken !== null && {
                    Authorization: `Bearer ${accessToken}`
                })
            },
            ...restConfig
        });
    } catch (e) {
        showErrorToast && toast.error(getDetail(e));
        throw e;
    }

    return res.data;
};
