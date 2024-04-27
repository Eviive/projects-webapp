import { useInfiniteQuery } from "@tanstack/react-query";
import { Page } from "components/common/page";
import { SkillCard } from "components/skills/skill-card";
import { SkillFormDialog } from "components/skills/skill-form-dialog";
import { SkillSortButton, sortSkillsMutationKey } from "components/skills/skill-sort-button";
import { Button } from "components/ui/button";
import { ErrorAlert } from "components/ui/error-alert";
import { Loader } from "components/ui/loader";
import { SearchBar } from "components/ui/search-bar";
import { useOptimisticSort } from "hooks/use-optimistic-sort";
import { Grid } from "layouts/grid";
import { updateSearchParams } from "libs/utils/search-params";
import type { skillsLoader } from "pages/skills/skills.loader";
import { skillsQueryOptionsFn } from "pages/skills/skills.loader";
import type { FC } from "react";
import { useCallback, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useLoaderData, useSearchParams } from "react-router-dom";
import type { QueryLoaderFunctionData } from "types/loader";

export const Skills: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search") ?? undefined;

    const initialSkills = useLoaderData() as QueryLoaderFunctionData<typeof skillsLoader>;

    const skillsQuery = useInfiniteQuery({
        ...skillsQueryOptionsFn(search),
        initialData: initialSkills ?? undefined
    });

    const [optimisticSkills, optimisticSkillSorts] = useOptimisticSort(
        sortSkillsMutationKey,
        skillsQuery
    );

    const [searchBarValue, setSearchBarValue] = useState(search ?? "");
    const setSearchQueryParam = useCallback(
        (search: string) =>
            updateSearchParams(setSearchParams, {
                key: "search",
                value: search
            }),
        [setSearchParams]
    );

    return (
        <Page title="Skills">
            <div className="flex h-full w-full grow flex-col gap-9 px-[5%] py-9">
                <div className="flex w-full max-w-md items-center gap-2 self-center">
                    <SearchBar
                        value={searchBarValue}
                        handleChange={setSearchBarValue}
                        handleDebounce={setSearchQueryParam}
                        isDisabled={skillsQuery.isError}
                    />
                    <SkillSortButton />
                    <SkillFormDialog
                        trigger={
                            <Button className="text-foreground-500" variant="outline" size="icon">
                                <FaPlus size={20} />
                            </Button>
                        }
                    />
                </div>
                {skillsQuery.isSuccess && (
                    <>
                        <Grid minWidth="175px" gap="2em" columnCount="infinity" centerHorizontally>
                            {optimisticSkills.map(skill => (
                                <SkillCard
                                    key={skill.id}
                                    skill={skill}
                                    isOptimistic={optimisticSkillSorts[skill.id] !== undefined}
                                />
                            ))}
                        </Grid>
                        {skillsQuery.hasNextPage && (
                            <Button
                                className="self-center"
                                onClick={() => skillsQuery.fetchNextPage()}
                                disabled={skillsQuery.isFetchingNextPage}
                            >
                                {skillsQuery.isFetchingNextPage ? "Loading more..." : "Load More"}
                            </Button>
                        )}
                    </>
                )}
                {skillsQuery.isLoading && <Loader deferred />}
                {skillsQuery.isError && <ErrorAlert error={skillsQuery.error} />}
            </div>
        </Page>
    );
};
