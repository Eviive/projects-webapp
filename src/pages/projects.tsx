import { useMutationState, useQuery } from "@tanstack/react-query";
import { ProjectService } from "api/services/project";
import { Page } from "components/common/page";
import { ProjectCard } from "components/projects/project-card";
import { ProjectFormDialog } from "components/projects/project-form-dialog";
import {
    ProjectSortDialog,
    sortProjectsMutationKey
} from "components/projects/project-sort-dialog";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Button } from "components/ui/button";
import { Loader } from "components/ui/loader";
import { SearchBar } from "components/ui/search-bar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { Grid } from "layouts/grid";
import { getTitleAndMessage } from "lib/utils/error";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { LuAlertCircle } from "react-icons/lu";
import { MdDragHandle } from "react-icons/md";
import type { DndSaveItem } from "types/dnd";

export const Projects: FC = () => {
    const query = useQuery({
        queryKey: ["projects"],
        queryFn: ProjectService.findAll
    });

    const error = query.isError ? getTitleAndMessage(query.error) : null;

    const optimisticProjectSorts = useMutationState<DndSaveItem[]>({
        filters: {
            mutationKey: sortProjectsMutationKey,
            status: "pending"
        },
        select: mutation => mutation.state.variables as DndSaveItem[]
    });

    const optimisticProjectSortItems = useMemo(() => {
        const items: Record<number, number> = {};

        for (const sortItem of optimisticProjectSorts.flatMap(i => i)) {
            items[sortItem.id] = sortItem.sort;
        }

        return items;
    }, [optimisticProjectSorts]);

    const optimisticProjects = useMemo(() => {
        if (!query.isSuccess) return [];

        const optProjects = [...query.data];

        for (const project of optProjects) {
            if (optimisticProjectSortItems[project.id] !== undefined) {
                project.sort = optimisticProjectSortItems[project.id];
            }
        }

        optProjects.sort((a, b) => a.sort - b.sort);

        return optProjects;
    }, [query.data, query.isSuccess, optimisticProjectSortItems]);

    const [searchBarValue, setSearchBarValue] = useState("");
    const [searchQuery, setSearchQuery] = useState(searchBarValue);

    const optimisticFilteredProjects = useMemo(() => {
        return optimisticProjects.filter(project =>
            project.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
    }, [optimisticProjects, searchQuery]);

    return (
        <Page title="Projects">
            <div className="flex h-full w-full grow flex-col gap-9 px-[5%] py-9">
                <div className="flex w-full max-w-md items-center gap-2 self-center">
                    <SearchBar
                        value={searchBarValue}
                        handleChange={setSearchBarValue}
                        debounce={300}
                        handleDebounce={setSearchQuery}
                        isDisabled={query.isLoading || query.isError}
                    />
                    <TooltipProvider>
                        <Tooltip>
                            <ProjectSortDialog
                                initialProjects={optimisticProjects}
                                trigger={
                                    <TooltipTrigger asChild>
                                        <Button
                                            className="text-foreground-500"
                                            variant="outline"
                                            size="icon"
                                            disabled={query.isLoading || query.isError}
                                        >
                                            <MdDragHandle size={24} />
                                        </Button>
                                    </TooltipTrigger>
                                }
                            />
                            <TooltipContent>Sort projects</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <ProjectFormDialog
                                trigger={
                                    <TooltipTrigger asChild>
                                        <Button
                                            className="text-foreground-500"
                                            variant="outline"
                                            size="icon"
                                        >
                                            <FaPlus size={20} />
                                        </Button>
                                    </TooltipTrigger>
                                }
                            />
                            <TooltipContent>Add a new project</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                {query.isSuccess && (
                    <Grid minWidth="350px" gap="2.5em" columnCount={3} centerHorizontally>
                        {optimisticFilteredProjects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                isOptimistic={optimisticProjectSortItems[project.id] !== undefined}
                            />
                        ))}
                    </Grid>
                )}
                {query.isLoading && <Loader />}
                {query.isError && error !== null && (
                    <Alert variant="destructive">
                        <LuAlertCircle className="h-4 w-4" />
                        <AlertTitle>{error.title}</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}
            </div>
        </Page>
    );
};
