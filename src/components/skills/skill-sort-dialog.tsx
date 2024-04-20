import { useQuery } from "@tanstack/react-query";
import { ImageService } from "api/services/image";
import { SkillService } from "api/services/skill";
import { SortDialogContent } from "components/common/sort-dialog/sort-dialog-content";
import { useSortDialogContext } from "components/common/sort-dialog/sort-dialog-context";
import { Loader } from "components/ui/loader";
import { SKILL_PLACEHOLDER } from "libs/constants";
import type { FC } from "react";

export const SkillSortDialog: FC = () => {
    const { contentRef, handleClose } = useSortDialogContext();

    const lightProjectsQuery = useQuery({
        queryKey: ["skills"],
        queryFn: SkillService.findAll,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });

    return (
        <SortDialogContent
            ref={contentRef}
            initialItems={lightProjectsQuery.data}
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
            empty={lightProjectsQuery.data?.length === 0 && "No skills found."}
            loading={
                lightProjectsQuery.isLoading && (
                    <div className="flex flex-col gap-3">
                        <Loader />
                        Loading skills...
                    </div>
                )
            }
            error={lightProjectsQuery.isError && "Failed to load skills."}
        />
    );
};
