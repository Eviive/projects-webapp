import { QueryFunction, QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthContext } from "contexts/AuthContext";
import toast from "react-hot-toast";
import { getTitleAndMessage } from "utils/errors";

/*
	See the "useLocalStorage" hook for an explanation about the type parameter: "T,"
*/
export const useCustomQuery = <T,>(queryKey: QueryKey, queryFn: QueryFunction<T, QueryKey>, options?: UseQueryOptions<T>) => {

    const { setAccessToken } = useAuthContext();

    return useQuery<T>(queryKey, queryFn, {
        onError(e) {
            if (e instanceof AxiosError && e.response?.status === 401) {
                setAccessToken("");
            } else {
                toast.error(getTitleAndMessage(e));
            }
        },
        ...options
    });
};
