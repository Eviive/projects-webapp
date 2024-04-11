import { queryOptions } from "@tanstack/react-query";
import { SkillService } from "api/services/skill";
import type { Skill } from "types/entities/skill";
import type { QueryLoaderFunction } from "types/loader";

export const skillsQueryOptions = queryOptions({
    queryKey: ["skills"],
    queryFn: SkillService.findAll
});

export const skillsLoader: QueryLoaderFunction<Skill[]> = qC => async () =>
    qC.getQueryData(skillsQueryOptions.queryKey) ?? (await qC.fetchQuery(skillsQueryOptions));
