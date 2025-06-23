import { useInfiniteQuery } from "@tanstack/react-query";
import { Page } from "components/common/page";
import { RequireAuthority } from "components/common/require-authority";
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
import { getSkillsQueryParams, skillsQueryOptionsFn } from "pages/skills/skills.loader";
import type { FC } from "react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useSearchParams } from "react-router";

export const Skills: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const { search } = getSkillsQueryParams(searchParams);

    const skillsQuery = useInfiniteQuery(skillsQueryOptionsFn(search));

    const [optimisticSkills, optimisticSkillSorts] = useOptimisticSort(
        sortSkillsMutationKey,
        skillsQuery
    );

    const [searchBarValue, setSearchBarValue] = useState(search ?? "");
    const setSearchQueryParam = (search: string) => {
        updateSearchParams(setSearchParams, {
            key: "search",
            value: search
        });
    };

    return (
        <Page title="Skills">
            <div className="flex size-full grow flex-col gap-9 px-[5%] py-9">
                <div className="flex w-full max-w-md items-center gap-2 self-center">
                    <SearchBar
                        value={searchBarValue}
                        handleChange={setSearchBarValue}
                        handleDebounce={setSearchQueryParam}
                        isDisabled={skillsQuery.isError}
                    />
                    <RequireAuthority authority={["create:skill", "update:skill", "delete:skill"]}>
                        <SkillSortButton />
                        <SkillFormDialog
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
                {skillsQuery.isSuccess && (
                    <>
                        <Grid minWidth="175px" gap="2em" centerHorizontally>
                            {optimisticSkills.map(skill => (
                                <SkillCard
                                    key={skill.id}
                                    skill={skill}
                                    isOptimistic={skill.id in optimisticSkillSorts}
                                />
                            ))}
                        </Grid>
                        {skillsQuery.hasNextPage && (
                            <Button
                                className="self-center"
                                onClick={() => skillsQuery.fetchNextPage()}
                                disabled={skillsQuery.isFetchingNextPage}
                            >
                                {skillsQuery.isFetchingNextPage ? "Loading more..." : "Load more"}
                            </Button>
                        )}
                    </>
                )}
                {skillsQuery.isLoading && <Loader defer />}
                {skillsQuery.isError && <ErrorAlert error={skillsQuery.error} />}
            </div>
        </Page>
    );
};
