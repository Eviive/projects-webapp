import { useMutationState, useQuery } from "@tanstack/react-query";
import { SkillService } from "api/services/skill";
import { Page } from "components/common/page";
import { SkillCard } from "components/skills/skill-card";
import { SkillFormDialog } from "components/skills/skill-form-dialog";
import { SkillSortDialog, sortSkillsMutationKey } from "components/skills/skill-sort-dialog";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Button } from "components/ui/button";
import { Loader } from "components/ui/loader";
import { SearchBar } from "components/ui/search-bar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { Grid } from "layouts/grid";
import { getTitleAndMessage } from "lib/utils/error";
import { type FC, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { LuAlertCircle } from "react-icons/lu";
import { MdDragHandle } from "react-icons/md";
import type { DndSaveItem } from "types/dnd";

export const Skills: FC = () => {
    const query = useQuery({
        queryKey: ["skills"],
        queryFn: SkillService.findAll
    });

    const error = query.isError ? getTitleAndMessage(query.error) : null;

    const optimisticSkillSorts = useMutationState<DndSaveItem[]>({
        filters: {
            mutationKey: sortSkillsMutationKey,
            status: "pending"
        },
        select: mutation => mutation.state.variables as DndSaveItem[]
    });

    const optimisticSkillSortItems = useMemo(() => {
        const items: Record<number, number> = {};

        for (const sortItem of optimisticSkillSorts.flatMap(i => i)) {
            items[sortItem.id] = sortItem.sort;
        }

        return items;
    }, [optimisticSkillSorts]);

    const optimisticSkills = useMemo(() => {
        if (!query.isSuccess) return [];

        const optSkills = [...query.data];

        for (const skill of optSkills) {
            if (optimisticSkillSortItems[skill.id] !== undefined) {
                skill.sort = optimisticSkillSortItems[skill.id];
            }
        }

        optSkills.sort((a, b) => a.sort - b.sort);

        return optSkills;
    }, [query.data, query.isSuccess, optimisticSkillSortItems]);

    const [searchBarValue, setSearchBarValue] = useState("");
    const [searchQuery, setSearchQuery] = useState(searchBarValue);

    const optimisticFilteredSkills = useMemo(() => {
        return optimisticSkills.filter(skill =>
            skill.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
    }, [optimisticSkills, searchQuery]);

    return (
        <Page title="Skills">
            <div className="flex h-full w-full grow flex-col gap-12 px-[5%] py-12">
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
                            <SkillSortDialog
                                initialSkills={optimisticSkills}
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
                            <TooltipContent>Sort skills</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <SkillFormDialog
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
                            <TooltipContent>Add a new skill</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                {query.isSuccess && (
                    <Grid minWidth="140px" gap="2em" columnCount="infinity" centerHorizontally>
                        {optimisticFilteredSkills.map(skill => (
                            <SkillCard
                                key={skill.id}
                                skill={skill}
                                isOptimistic={optimisticSkillSortItems[skill.id] !== undefined}
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
