import type { QueryClient } from "@tanstack/react-query";
import type { LoaderFunctionArgs } from "react-router-dom";

export type QueryLoaderFunction<T> = (
    queryClient: QueryClient
) => (args: LoaderFunctionArgs) => T | Promise<T>;

export type QueryLoaderFunctionData<F extends QueryLoaderFunction<unknown>> = Awaited<
    ReturnType<ReturnType<F>>
>;
