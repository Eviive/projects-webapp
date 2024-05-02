import { queryOptions } from "@tanstack/react-query";
import { HealthService } from "api/services/health";
import { protectedQueryLoader, queryLoader } from "libs/utils/loader";
import type { HttpExchange } from "types/health";
import type { QueryLoaderFunction } from "types/loader";

export const httpExchangesQueryOptions = queryOptions({
    queryKey: ["httpExchanges"],
    queryFn: HealthService.httpExchanges
});

const healthQueryLoader: QueryLoaderFunction<HttpExchange[] | null> = qC => async () => {
    return queryLoader(qC, httpExchangesQueryOptions);
};

export const healthLoader = protectedQueryLoader(["read:actuator"], healthQueryLoader);
