import { QueryFunction, QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthContext } from "contexts/AuthContext";

/*
	See the "useLocalStorage" hook for an explanation about the type parameter: "T,"
*/
export const useCustomQuery = <T,>(queryKey: QueryKey, queryFn: QueryFunction<T, QueryKey>, options?: UseQueryOptions<T>) => {

    const { setAccessToken } = useAuthContext();

    return useQuery<T>(queryKey, queryFn, {
        onError(err) {
            if (err instanceof AxiosError && err.response?.status === 401) {
                setAccessToken("");
            }
        },
        ...options
    });
};
