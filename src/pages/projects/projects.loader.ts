import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { PROJECTS_DEFAULT_PAGE_SIZE, ProjectService } from "api/services/project";
import { protectedQueryLoader } from "libs/loader/protected-loader";
import { queryLoader } from "libs/loader/query-loader";
import { getNumberSearchParam } from "libs/utils/search-params";
import type { Project } from "types/entities/project";
import type { QueryLoaderFunction } from "types/loader";
import type { Page } from "types/pagination/page";

export const getProjectsQueryParams = (searchParams: URLSearchParams) => {
    const page = getNumberSearchParam(searchParams, "page") ?? 0;
    const size = getNumberSearchParam(searchParams, "size") ?? PROJECTS_DEFAULT_PAGE_SIZE;
    const search = searchParams.get("search") ?? undefined;

    return {
        page,
        size,
        search
    };
};

export const projectsQueryOptionsFn = (page?: number, size?: number, search?: string) =>
    queryOptions({
        queryKey: ["projects", page, size, search],
        queryFn: () => ProjectService.findPage(page, size, search),
        placeholderData: keepPreviousData
    });

const projectsQueryLoader: QueryLoaderFunction<Page<Project> | null> =
    qC =>
    ({ request }) => {
        const searchParams = new URL(request.url).searchParams;

        const { page, size, search } = getProjectsQueryParams(searchParams);

        const projectsQueryOptions = projectsQueryOptionsFn(page, size, search);

        return queryLoader(qC, projectsQueryOptions);
    };

export const projectsLoader = protectedQueryLoader(projectsQueryLoader);
