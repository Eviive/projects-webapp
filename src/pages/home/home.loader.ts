import { queryOptions } from "@tanstack/react-query";
import { HealthService } from "api/services/health";
import { queryLoader } from "libs/loader/query-loader";
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

export const homeLoader: QueryLoaderFunction<{
    info: Info | null;
    health: Health | null;
}> = qC => async () => {
    const [info, health] = await Promise.all([
        queryLoader(qC, infoQueryOptions),
        queryLoader(qC, healthQueryOptions)
    ]);

    return {
        info,
        health
    };
};
