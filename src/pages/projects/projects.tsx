import { useQuery } from "@tanstack/react-query";
import { PROJECTS_PAGE_SIZE_OPTIONS } from "api/services/project";
import { Page } from "components/common/page";
import { RequireAuthority } from "components/common/require-authority";
import { ProjectCard } from "components/projects/project-card";
import { ProjectFormDialog } from "components/projects/project-form-dialog";
import {
    ProjectSortButton,
    sortProjectsMutationKey
} from "components/projects/project-sort-button";
import { Button } from "components/ui/button";
import { ErrorAlert } from "components/ui/error-alert";
import { Loader } from "components/ui/loader";
import { Pagination } from "components/ui/pagination";
import { SearchBar } from "components/ui/search-bar";
import { useOptimisticSort } from "hooks/use-optimistic-sort";
import { Grid } from "layouts/grid";
import { clamp } from "libs/utils/math";
import { updateSearchParams } from "libs/utils/search-params";
import { getProjectsQueryParams, projectsQueryOptionsFn } from "pages/projects/projects.loader";
import type { FC } from "react";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";

export const Projects: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const { page, size, search } = getProjectsQueryParams(searchParams);

    const projectsQuery = useQuery(projectsQueryOptionsFn(page, size, search));

    const [optimisticProjects, optimisticProjectSorts] = useOptimisticSort(
        sortProjectsMutationKey,
        projectsQuery
    );

    const [searchBarValue, setSearchBarValue] = useState(search ?? "");
    const setSearchQueryParam = useCallback(
        (search: string) => {
            updateSearchParams(
                setSearchParams,
                {
                    key: "search",
                    value: search
                },
                {
                    key: "page",
                    value: null
                }
            );
        },
        [setSearchParams]
    );

    useLayoutEffect(() => {
        if (!projectsQuery.isSuccess) return;

        if (
            projectsQuery.data.totalPages !== 0 &&
            (page < 0 || page >= projectsQuery.data.totalPages)
        ) {
            updateSearchParams(setSearchParams, {
                key: "page",
                value: clamp(page, 0, projectsQuery.data.totalPages - 1)
            });
        }
    }, [page, projectsQuery.data?.totalPages, projectsQuery.isSuccess, setSearchParams]);

    useEffect(() => {
        document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    return (
        <Page title="Projects">
            <div className="flex h-full w-full grow flex-col gap-9 px-[5%] py-9">
                <div className="flex w-full max-w-md items-center gap-2 self-center">
                    <SearchBar
                        value={searchBarValue}
                        handleChange={setSearchBarValue}
                        handleDebounce={setSearchQueryParam}
                        isDisabled={projectsQuery.isError}
                    />
                    <RequireAuthority
                        authority={["create:project", "update:project", "delete:project"]}
                    >
                        <ProjectSortButton />
                        <ProjectFormDialog
                            trigger={
                                <Button
                                    className="text-foreground-500"
                                    variant="outline"
                                    size="icon"
                                >
                                    <FaPlus size={20} />
                                </Button>
                            }
                        />
                    </RequireAuthority>
                </div>
                {projectsQuery.isSuccess && (
                    <>
                        <Grid minWidth="350px" gap="2.5em" columnCount={3} centerHorizontally>
                            {optimisticProjects.map(project => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    isOptimistic={optimisticProjectSorts[project.id] !== undefined}
                                />
                            ))}
                        </Grid>
                        <Pagination
                            itemName="project"
                            pageSize={size}
                            pageSizeOptions={PROJECTS_PAGE_SIZE_OPTIONS}
                            setPageSize={pageSize => {
                                updateSearchParams(setSearchParams, {
                                    key: "size",
                                    value: pageSize
                                });
                            }}
                            pageIndex={page}
                            setPageIndex={pageIndex => {
                                updateSearchParams(setSearchParams, {
                                    key: "page",
                                    value: pageIndex
                                });
                            }}
                            getPageCount={() => projectsQuery.data.totalPages}
                            getCanPreviousPage={() => !projectsQuery.data.first}
                            getCanNextPage={() => !projectsQuery.data.last}
                            previousPage={() => {
                                updateSearchParams(setSearchParams, {
                                    key: "page",
                                    value: page - 1
                                });
                            }}
                            nextPage={() => {
                                updateSearchParams(setSearchParams, {
                                    key: "page",
                                    value: page + 1
                                });
                            }}
                        />
                    </>
                )}
                {projectsQuery.isLoading && <Loader defer />}
                {projectsQuery.isError && <ErrorAlert error={projectsQuery.error} />}
            </div>
        </Page>
    );
};
