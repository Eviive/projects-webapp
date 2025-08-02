import type { MutationKey } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "api/services/project";
import { SortDialog } from "components/common/sort-dialog";
import { ProjectSortDialog } from "components/projects/project-sort-dialog";
import { Button } from "components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import type { FC } from "react";
import { MdDragHandle } from "react-icons/md";

export const sortProjectsMutationKey = ["sortProjects"] as const satisfies MutationKey;

export const ProjectSortButton: FC = () => {
    const queryClient = useQueryClient();

    const sortProjectsMutation = useMutation({
        mutationFn: ProjectService.sort,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
        mutationKey: sortProjectsMutationKey
    });

    return (
        <TooltipProvider>
            <Tooltip>
                <SortDialog
                    itemsName="projects"
                    trigger={
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MdDragHandle className="size-3/4" />
                            </Button>
                        </TooltipTrigger>
                    }
                    content={<ProjectSortDialog />}
                    mutation={sortProjectsMutation}
                />
                <TooltipContent>Sort projects</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
