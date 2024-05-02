import type { QueryClient } from "@tanstack/react-query";
import type { LoaderFunctionArgs } from "react-router-dom";

export type LoaderFunction<D> = (args: LoaderFunctionArgs) => D | Promise<D>;

export type QueryLoaderFunction<D> = (queryClient: QueryClient) => LoaderFunction<D>;

export type QueryLoaderFunctionData<F extends QueryLoaderFunction<unknown>> = Awaited<
    ReturnType<ReturnType<F>>
>;

export type ProtectedLoaderFunction<D> = LoaderFunction<D | Response>;

export type ProtectedQueryLoaderFunction<D> = QueryLoaderFunction<D | Response>;
