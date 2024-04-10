import { ProjectService } from "api/services/project";
import type { Project } from "types/entities/project";
import type { QueryLoaderFunction } from "types/loader";

export const projectsQuery = {
    queryKey: ["projects"],
    queryFn: ProjectService.findAll
};

export const projectsLoader: QueryLoaderFunction<Project[]> = qC => async () =>
    qC.getQueryData(projectsQuery.queryKey) ?? (await qC.fetchQuery(projectsQuery));
