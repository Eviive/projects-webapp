import type { MutationKey } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SkillService } from "api/services/skill";
import { SortDialog } from "components/common/sort-dialog";
import { SkillSortDialog } from "components/skills/skill-sort-dialog";
import { Button } from "components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import type { FC } from "react";
import { MdDragHandle } from "react-icons/md";

export const sortSkillsMutationKey = ["sortSkills"] as const satisfies MutationKey;

export const SkillSortButton: FC = () => {
    const queryClient = useQueryClient();

    const sortSkillsMutation = useMutation({
        mutationFn: SkillService.sort,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
        mutationKey: sortSkillsMutationKey
    });

    return (
        <TooltipProvider>
            <Tooltip>
                <SortDialog
                    itemsName="skills"
                    trigger={
                        <TooltipTrigger asChild>
                            <Button className="text-foreground-500" variant="outline" size="icon">
                                <MdDragHandle size={24} />
                            </Button>
                        </TooltipTrigger>
                    }
                    content={<SkillSortDialog />}
                    mutation={sortSkillsMutation}
                />
                <TooltipContent>Sort skills</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
