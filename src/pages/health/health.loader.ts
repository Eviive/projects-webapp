import { queryOptions } from "@tanstack/react-query";
import { HealthService } from "api/services/health";
import type { HttpExchange } from "types/health";
import type { QueryLoaderFunction } from "types/loader";

export const httpExchangesQueryOptions = queryOptions({
    queryKey: ["httpExchanges"],
    queryFn: HealthService.httpExchanges
});

export const healthLoader: QueryLoaderFunction<HttpExchange[]> = qC => async () =>
    qC.getQueryData(httpExchangesQueryOptions.queryKey) ??
    (await qC.fetchQuery(httpExchangesQueryOptions));
