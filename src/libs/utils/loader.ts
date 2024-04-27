import type {
    InfiniteData,
    QueryClient,
    QueryKey,
    UndefinedInitialDataInfiniteOptions
} from "@tanstack/react-query";
import type { UndefinedInitialDataOptions } from "@tanstack/react-query/src/queryOptions";
import { authContext } from "contexts/auth-context";
import { redirect } from "react-router-dom";
import type { LoaderFunction } from "types/loader";

export const protectedLoader = <V>(loader: LoaderFunction<V>): LoaderFunction<V | Response> => {
    return args => {
        if (authContext.accessToken === null) {
            const searchParams = new URLSearchParams();

            let redirectPath = new URL(args.request.url).pathname;

            const routerBaseUrl = import.meta.env.VITE_ROUTER_BASE_URL;
            if (routerBaseUrl && redirectPath?.startsWith(routerBaseUrl)) {
                redirectPath = redirectPath.substring(routerBaseUrl.length);
            }

            searchParams.set("redirect", redirectPath);

            return redirect(`/login?${searchParams.toString()}`);
        }

        return loader(args);
    };
};

export const queryLoader = async <D, E, K extends QueryKey>(
    queryClient: QueryClient,
    queryOpts: UndefinedInitialDataOptions<D, E, D, K>
): Promise<D | null> => {
    try {
        return (
            queryClient.getQueryData(queryOpts.queryKey) ??
            (await queryClient.fetchQuery(queryOpts))
        );
    } catch (error) {
        return null;
    }
};

export const infiniteQueryLoader = async <D, E, K extends QueryKey, P>(
    queryClient: QueryClient,
    queryOpts: UndefinedInitialDataInfiniteOptions<D, E, InfiniteData<D, P>, K, P>
): Promise<InfiniteData<D, P> | null> => {
    try {
        return (
            queryClient.getQueryData(queryOpts.queryKey) ??
            (await queryClient.fetchInfiniteQuery(queryOpts))
        );
    } catch (error) {
        return null;
    }
};
