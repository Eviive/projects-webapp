import { useQuery } from "@tanstack/react-query";
import { ImageService } from "api/services/image";
import { SkillService } from "api/services/skill";
import { SortDialogContent } from "components/common/sort-dialog/sort-dialog-content";
import { useSortDialogContext } from "components/common/sort-dialog/sort-dialog-context";
import { sortSkillsMutationKey } from "components/skills/skill-sort-button";
import { Loader } from "components/ui/loader";
import { useOptimisticSort } from "hooks/use-optimistic-sort";
import { SKILL_PLACEHOLDER } from "libs/constants";
import type { FC } from "react";

export const SkillSortDialog: FC = () => {
    const { contentRef, handleClose } = useSortDialogContext();

    const skillsQuery = useQuery({
        queryKey: ["skills"],
        queryFn: SkillService.findAll,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });

    const [optimisticSkills] = useOptimisticSort(sortSkillsMutationKey, skillsQuery);

    return (
        <SortDialogContent
            ref={contentRef}
            initialItems={optimisticSkills}
            render={skill => (
                <div className="flex grow items-center gap-3">
                    <img
                        className="aspect-square object-cover drop-shadow-icon"
                        src={ImageService.getImageUrl(skill.image, "skills") ?? SKILL_PLACEHOLDER}
                        alt={skill.image.altEn}
                        width={36}
                        loading="lazy"
                    />
                    {skill.name}
                </div>
            )}
            closeDialog={resetSort => handleClose(false, resetSort)}
            empty={skillsQuery.isSuccess && optimisticSkills.length === 0 && "No skills found."}
            loading={
                skillsQuery.isLoading && (
                    <div className="flex flex-col gap-3">
                        <Loader />
                        Loading skills...
                    </div>
                )
            }
            error={skillsQuery.isError && "Failed to load skills."}
        />
    );
};
