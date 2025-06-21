import { initInterceptors } from "api/interceptors";
import type { AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from "axios";
import axios, { AxiosHeaders } from "axios";
import { getAuthContext } from "contexts/auth-context";
import { hasEveryAuthority } from "libs/auth";
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
    needsAccessToken?: boolean;
    showErrorToast?: boolean;
};

export const request = async <T = undefined, D = undefined>(
    url: string,
    config?: RequestConfig<D>
) => {
    const {
        headers,
        requiredAuthorities,
        needsAccessToken = true,
        showErrorToast = true,
        ...requestConfig
    } = config ?? {};

    if (requiredAuthorities !== undefined && !hasEveryAuthority(requiredAuthorities)) {
        const message = "You do not have the required authorities to perform this action.";
        toast.error(message);
        throw new Error(message);
    }

    const accessToken = needsAccessToken ? getAuthContext().accessToken : null;

    let axiosHeaders: RawAxiosRequestHeaders;
    if (headers instanceof AxiosHeaders) {
        axiosHeaders = headers.toJSON();
    } else {
        axiosHeaders = headers ?? {};
    }

    if (config?.data !== undefined) {
        axiosHeaders["Content-Type"] = "application/json";
    }

    if (accessToken !== null) {
        axiosHeaders.Authorization = `Bearer ${accessToken}`;
    }

    let res: AxiosResponse<T, D>;
    try {
        res = await httpClient.request<T, AxiosResponse<T, D>, D>({
            url,
            headers: axiosHeaders,
            ...requestConfig
        });
    } catch (e) {
        if (showErrorToast) {
            toast.error(getDetail(e));
        }
        throw e;
    }

    return res.data;
};
