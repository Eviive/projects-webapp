import { SkillService } from "api/services/skill";
import type { Skill } from "types/entities/skill";
import type { QueryLoaderFunction } from "types/loader";

export const skillsQuery = {
    queryKey: ["skills"],
    queryFn: SkillService.findAll
};

export const skillsLoader: QueryLoaderFunction<Skill[]> = qC => async () =>
    qC.getQueryData(skillsQuery.queryKey) ?? (await qC.fetchQuery(skillsQuery));
