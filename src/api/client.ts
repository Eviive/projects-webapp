import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { getFormattedTitleAndMessage } from "lib/utils/error";
import { toast } from "sonner";

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        Accept: "application/json"
    },
    withCredentials: true
});

type RequestConfig<D> = AxiosRequestConfig<D> & {
    needsAuth?: boolean;
    showErrorToast?: boolean;
};

export const request = async <T, D = undefined>(url: string, config?: RequestConfig<D>) => {
    const {
        method = "GET",
        data,
        headers,
        needsAuth = true,
        showErrorToast = true,
        ...restConfig
    } = config ?? {};

    let res: AxiosResponse<T, D>;
    try {
        res = await httpClient.request<T, AxiosResponse<T, D>, D>({
            url,
            method,
            data,
            headers: {
                ...(data && { "Content-Type": "application/json" }),
                ...headers,
                ...(needsAuth && { Authorization: "Bearer " })
            },
            ...restConfig
        });
    } catch (e) {
        showErrorToast && toast.error(getFormattedTitleAndMessage(e));
        throw e;
    }
    return res.data;
};
