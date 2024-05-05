import type { QueryClient } from "@tanstack/react-query";
import type { LoaderFunctionArgs } from "react-router-dom";
import type { Authority } from "types/auth";

export type LoaderFunction<D> = (args: LoaderFunctionArgs) => D | Promise<D>;

export type QueryLoaderFunction<D> = (queryClient: QueryClient) => LoaderFunction<D>;

export type QueryLoaderFunctionData<F extends QueryLoaderFunction<unknown>> = Awaited<
    ReturnType<ReturnType<F>>
>;

export type ProtectedLoaderFunction<D> = LoaderFunction<
    (D & { authorities: Authority[] }) | Response
>;

export type ProtectedQueryLoaderFunction<D> = QueryLoaderFunction<D | Response>;
