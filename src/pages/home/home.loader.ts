import { queryOptions } from "@tanstack/react-query";
import { HealthService } from "api/services/health";
import { queryLoader } from "libs/loader/query-loader";
import type { Info } from "types/health";
import type { QueryLoaderFunction } from "types/loader";

export const infoQueryOptions = queryOptions({
    queryFn: HealthService.info,
    queryKey: ["info"]
});

export const homeLoader: QueryLoaderFunction<Info | null> = qC => () =>
    queryLoader(qC, infoQueryOptions);
