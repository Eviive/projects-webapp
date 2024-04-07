import { type MutationKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "api/services/project";
import { SortDialog } from "components/common/sort-dialog";
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
            trigger={props.trigger}
            initialItems={props.initialProjects}
            mutation={sortProjectsMutation}
            render={project => project.title}
        />
    );
};
