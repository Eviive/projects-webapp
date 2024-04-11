import { queryOptions } from "@tanstack/react-query";
import { HealthService } from "api/services/health";
import type { Health, Info } from "types/health";
import type { QueryLoaderFunction } from "types/loader";

export const infoQueryOptions = queryOptions({
    queryFn: HealthService.info,
    queryKey: ["info"]
});

export const healthQueryOptions = queryOptions({
    queryFn: HealthService.health,
    queryKey: ["health"]
});

export const homeLoader: QueryLoaderFunction<{ info: Info; health: Health }> = qC => async () => {
    const promises = [
        qC.getQueryData(infoQueryOptions.queryKey) ?? qC.fetchQuery(infoQueryOptions),
        qC.getQueryData(healthQueryOptions.queryKey) ?? qC.fetchQuery(healthQueryOptions)
    ] as const;

    const [info, health] = await Promise.all(promises);

    return {
        info,
        health
    };
};
