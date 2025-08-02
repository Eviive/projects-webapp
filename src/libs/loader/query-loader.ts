import type {
    InfiniteData,
    QueryClient,
    QueryKey,
    UndefinedInitialDataInfiniteOptions,
    UndefinedInitialDataOptions
} from "@tanstack/react-query";

export const queryLoader = async <D, E, K extends QueryKey>(
    queryClient: QueryClient,
    queryOpts: UndefinedInitialDataOptions<D, E, D, K>
): Promise<D | null> => {
    return queryClient.fetchQuery<D, E, D, K>(queryOpts);
};

export const infiniteQueryLoader = async <D, E, K extends QueryKey, P>(
    queryClient: QueryClient,
    queryOpts: UndefinedInitialDataInfiniteOptions<D, E, InfiniteData<D, P>, K, P>
): Promise<InfiniteData<D, P> | null> => {
    return queryClient.fetchInfiniteQuery<D, E, D, K, P>(queryOpts);
};
