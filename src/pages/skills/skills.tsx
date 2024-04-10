import { useMutationState, useQuery } from "@tanstack/react-query";
import { Page } from "components/common/page";
import { SkillCard } from "components/skills/skill-card";
import { SkillFormDialog } from "components/skills/skill-form-dialog";
import { SkillSortDialog, sortSkillsMutationKey } from "components/skills/skill-sort-dialog";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Button } from "components/ui/button";
import { SearchBar } from "components/ui/search-bar";
import { useSearchBar } from "hooks/use-search-bar";
import { Grid } from "layouts/grid";
import { getTitleAndMessage } from "libs/utils/error";
import type { skillsLoader } from "pages/skills/skills.loader";
import { skillsQuery } from "pages/skills/skills.loader";
import { type FC, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { LuAlertCircle } from "react-icons/lu";
import { MdDragHandle } from "react-icons/md";
import { useLoaderData } from "react-router-dom";
import type { DndItem } from "types/dnd";
import type { QueryLoaderFunctionData } from "types/loader";

export const Skills: FC = () => {
    const initialSkills = useLoaderData() as QueryLoaderFunctionData<typeof skillsLoader>;

    const query = useQuery({ ...skillsQuery, initialData: initialSkills });

    const error = query.isError ? getTitleAndMessage(query.error) : null;

    const optimisticSkillSorts = useMutationState<DndItem[]>({
        filters: {
            mutationKey: sortSkillsMutationKey,
            status: "pending"
        },
        select: mutation => mutation.state.variables as DndItem[]
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

    const { searchBarValue, setSearchBarValue, searchQuery, setSearchQuery } = useSearchBar();

    const optimisticFilteredSkills = useMemo(() => {
        return optimisticSkills.filter(skill =>
            skill.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
    }, [optimisticSkills, searchQuery]);

    return (
        <Page title="Skills">
            <div className="flex h-full w-full grow flex-col gap-9 px-[5%] py-9">
                <div className="flex w-full max-w-md items-center gap-2 self-center">
                    <SearchBar
                        value={searchBarValue}
                        handleChange={setSearchBarValue}
                        handleDebounce={setSearchQuery}
                        isDisabled={query.isError}
                    />
                    <SkillSortDialog
                        initialSkills={optimisticSkills}
                        trigger={
                            <Button
                                className="text-foreground-500"
                                variant="outline"
                                size="icon"
                                disabled={query.isError}
                            >
                                <MdDragHandle size={24} />
                            </Button>
                        }
                    />
                    <SkillFormDialog
                        trigger={
                            <Button className="text-foreground-500" variant="outline" size="icon">
                                <FaPlus size={20} />
                            </Button>
                        }
                    />
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
