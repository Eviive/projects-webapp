import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "api/services/project";
import { SortDialogContent } from "components/common/sort-dialog/sort-dialog-content";
import { useSortDialogContext } from "components/common/sort-dialog/sort-dialog-context";
import { Loader } from "components/ui/loader";
import type { FC } from "react";
import { ProjectFeaturedBadge } from "./project-featured-badge";

export const ProjectSortDialog: FC = () => {
    const { contentRef, handleClose } = useSortDialogContext();

    const lightProjectsQuery = useQuery({
        queryKey: ["projects", "light"],
        queryFn: ProjectService.findAllLight,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });

    return (
        <SortDialogContent
            ref={contentRef}
            initialItems={lightProjectsQuery.data}
            render={lightProject => (
                <div className="flex grow items-center gap-3">
                    {lightProject.title}
                    {lightProject.featured && <ProjectFeaturedBadge />}
                </div>
            )}
            closeDialog={resetSort => handleClose(false, resetSort)}
            empty={lightProjectsQuery.data?.length === 0 && "No projects found."}
            loading={
                lightProjectsQuery.isLoading && (
                    <div className="flex flex-col gap-3">
                        <Loader />
                        Loading projects...
                    </div>
                )
            }
            error={lightProjectsQuery.isError && "Failed to load projects."}
        />
    );
};
