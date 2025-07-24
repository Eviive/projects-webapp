import { initInterceptors } from "api/interceptors";
import type { AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from "axios";
import axios, { AxiosHeaders } from "axios";
import { hasEveryAuthority } from "libs/auth";
import { toast } from "sonner";
import type { Authority } from "types/auth";

export const httpClient = axios.create({
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

initInterceptors(httpClient);

type RequestConfig<D> = AxiosRequestConfig<D> & {
    requiredAuthorities?: Authority[];
};

export const request = <T = undefined, D = undefined>(
    url: string,
    config?: RequestConfig<D>
): Promise<AxiosResponse<T, D>> => {
    const { headers, requiredAuthorities, ...requestConfig } = config ?? {};

    if (requiredAuthorities !== undefined && !hasEveryAuthority(requiredAuthorities)) {
        const message = "You do not have the required authorities to perform this action.";
        toast.error(message);
        throw new Error(message);
    }

    let axiosHeaders: RawAxiosRequestHeaders;
    if (headers instanceof AxiosHeaders) {
        axiosHeaders = headers.toJSON();
    } else {
        axiosHeaders = headers ?? {};
    }

    if (config?.data !== undefined && axiosHeaders["Content-Type"] !== undefined) {
        axiosHeaders["Content-Type"] = "application/json";
    }

    return httpClient.request<T, AxiosResponse<T, D>, D>({
        url,
        headers: axiosHeaders,
        ...requestConfig
    });
};

export const requestData = async <T = undefined, D = undefined>(
    url: string,
    config?: RequestConfig<D>
): Promise<T> => {
    const res = await request<T, D>(url, config);
    return res.data;
};
