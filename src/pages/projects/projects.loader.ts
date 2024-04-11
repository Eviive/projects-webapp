import { queryOptions } from "@tanstack/react-query";
import { ProjectService } from "api/services/project";
import type { Project } from "types/entities/project";
import type { QueryLoaderFunction } from "types/loader";

export const projectsQueryOptions = queryOptions({
    queryKey: ["projects"],
    queryFn: ProjectService.findAll
});

export const projectsLoader: QueryLoaderFunction<Project[]> = qC => async () =>
    qC.getQueryData(projectsQueryOptions.queryKey) ?? (await qC.fetchQuery(projectsQueryOptions));
