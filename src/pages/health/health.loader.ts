import { queryOptions } from "@tanstack/react-query";
import { HealthService } from "api/services/health";
import { protectedQueryLoader } from "libs/utils/loader/protected-loader";
import { queryLoader } from "libs/utils/loader/query-loader";
import type { HttpExchange } from "types/health";
import type { QueryLoaderFunction } from "types/loader";

export const httpExchangesQueryOptions = queryOptions({
    queryKey: ["httpExchanges"],
    queryFn: HealthService.httpExchanges
});

export const healthQueryLoader: QueryLoaderFunction<HttpExchange[] | null> = qC => async () => {
    return queryLoader(qC, httpExchangesQueryOptions);
};

export const healthLoader = protectedQueryLoader(healthQueryLoader);
