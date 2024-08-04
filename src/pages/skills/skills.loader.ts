import type { InfiniteData } from "@tanstack/react-query";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { SKILLS_DEFAULT_PAGE_SIZE, SkillService } from "api/services/skill";
import { protectedQueryLoader } from "libs/loader/protected-loader";
import { infiniteQueryLoader } from "libs/loader/query-loader";
import type { Skill } from "types/entities/skill";
import type { QueryLoaderFunction } from "types/loader";
import type { Slice } from "types/pagination";

export const getSkillsQueryParams = (searchParams: URLSearchParams) => {
    const search = searchParams.get("search") ?? undefined;

    return { search };
};

export const skillsQueryOptionsFn = (search?: string) =>
    infiniteQueryOptions({
        queryKey: ["skills", search],
        queryFn: page => SkillService.findSlice(page.pageParam, SKILLS_DEFAULT_PAGE_SIZE, search),
        initialPageParam: 0,
        getNextPageParam: lastPage => (!lastPage.last ? lastPage.number + 1 : null),
        select: data => data
    });

export const skillsQueryLoader: QueryLoaderFunction<InfiniteData<Slice<Skill>, number> | null> =
    qC =>
    async ({ request }) => {
        const searchParams = new URL(request.url).searchParams;

        const { search } = getSkillsQueryParams(searchParams);

        const skillsQueryOptions = skillsQueryOptionsFn(search);

        return infiniteQueryLoader(qC, skillsQueryOptions);
    };

export const skillsLoader = protectedQueryLoader(skillsQueryLoader);
