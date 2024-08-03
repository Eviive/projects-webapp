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
