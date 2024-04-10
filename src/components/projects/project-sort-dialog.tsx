import { type MutationKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "api/services/project";
import { SortDialog } from "components/common/sort-dialog";
import { ProjectFeaturedBadge } from "components/projects/project-featured-badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import type { FC, ReactNode } from "react";
import type { Project } from "types/entities/project";

export const sortProjectsMutationKey = ["sortProjects"] as const satisfies MutationKey;

type Props = {
    initialProjects: Project[] | null;
    trigger: ReactNode;
};

export const ProjectSortDialog: FC<Props> = props => {
    const queryClient = useQueryClient();

    const sortProjectsMutation = useMutation({
        mutationFn: ProjectService.sort,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
        mutationKey: sortProjectsMutationKey
    });

    return (
        <SortDialog
            itemsName="projects"
            trigger={
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>{props.trigger}</TooltipTrigger>
                        <TooltipContent>Sort projects</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            }
            initialItems={props.initialProjects}
            mutation={sortProjectsMutation}
            render={project => (
                <div className="flex grow items-center gap-3">
                    {project.title}
                    {project.featured && <ProjectFeaturedBadge />}
                </div>
            )}
        />
    );
};
