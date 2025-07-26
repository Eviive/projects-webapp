import { RequireAuthority } from "components/common/require-authority";
import { ProjectFeaturedBadge } from "components/projects/project-featured-badge";
import { ProjectFormDialog } from "components/projects/project-form-dialog";
import { Button } from "components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { getImageUrl } from "libs/assets/image";
import { PROJECT_PLACEHOLDER, SKILL_PLACEHOLDER } from "libs/constants";
import { monthYearFormatter } from "libs/intl-formatter";
import type { FC } from "react";
import { MdEdit } from "react-icons/md";

import type { Project } from "types/entities/project";

interface Props {
    project: Project;
    isOptimistic: boolean;
}

export const ProjectCard: FC<Props> = ({ project, isOptimistic }) => {
    project.skills.sort((a, b) => a.sort - b.sort);

    const skills = project.skills.map(s => (
        <img
            key={s.id}
            className="drop-shadow-icon aspect-square object-cover"
            src={getImageUrl(s.image, "skills") ?? SKILL_PLACEHOLDER}
            alt={s.image.altEn}
            width={35}
            loading="lazy"
        />
    ));

    return (
        <li className="self-stretch justify-self-stretch">
            <Card className="flex size-full flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-1.5 truncate">
                            {project.title}
                            {project.featured && <ProjectFeaturedBadge />}
                        </CardTitle>
                        <CardDescription>
                            {monthYearFormatter.format(new Date(project.creationDate))}
                        </CardDescription>
                    </div>
                    <RequireAuthority authority={["update:project", "delete:project"]}>
                        <TooltipProvider>
                            <Tooltip>
                                <ProjectFormDialog
                                    project={project}
                                    trigger={
                                        <TooltipTrigger asChild>
                                            <Button
                                                className="size-7"
                                                variant="outline"
                                                size="icon"
                                                disabled={isOptimistic}
                                            >
                                                <MdEdit />
                                            </Button>
                                        </TooltipTrigger>
                                    }
                                />
                                <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </RequireAuthority>
                </CardHeader>
                <Separator />
                <CardContent className="flex grow flex-col justify-between gap-3">
                    <p className="line-clamp-4">{project.descriptionEn}</p>
                    <div>
                        <img
                            className="mx-auto aspect-[16/10] rounded-sm object-cover drop-shadow-lg"
                            src={getImageUrl(project.image, "projects") ?? PROJECT_PLACEHOLDER}
                            alt={project.image.altEn}
                            width={512}
                            loading="lazy"
                        />
                        <div className="mt-3 flex justify-center gap-3">{skills}</div>
                    </div>
                </CardContent>
            </Card>
        </li>
    );
};
