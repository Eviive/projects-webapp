import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Accept": "application/json"
    },
    withCredentials: true
});

export const request = async <T, D = undefined>(url: string, config?: AxiosRequestConfig<D>, auth = true) => {
    const res = await httpClient.request<T, AxiosResponse<T, D>, D>({
        url,
        method: config?.method ?? "GET",
        data: config?.data,
        headers: {
            ...config?.data && { "Content-Type": "application/json" },
            ...config?.headers,
            ...auth && { "Authorization": "Bearer " }
        }
    });
    return res.data;
};
