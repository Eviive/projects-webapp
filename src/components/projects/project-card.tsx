import { ImageService } from "api/services/image";
import { ProjectFormDialog } from "components/projects/project-form-dialog";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { PROJECT_PLACEHOLDER, SKILL_PLACEHOLDER } from "lib/constants";
import type { FC } from "react";
import { useMemo } from "react";
import { FaHeart } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";

import type { Project } from "types/entities/project";

const dateFormatter = Intl.DateTimeFormat("en-GB", { dateStyle: "short" });

type Props = {
    project: Project;
    isOptimistic: boolean;
};

export const ProjectCard: FC<Props> = ({ project, isOptimistic }) => {
    const skills = useMemo(() => {
        project.skills.sort((a, b) => a.sort - b.sort);

        return project.skills.map(s => (
            <img
                key={s.id}
                className="aspect-square object-cover drop-shadow-[0_1px_1px_hsl(0deg,0%,0%,0.5)]"
                src={ImageService.getImageUrl(s.image, "skills") ?? SKILL_PLACEHOLDER}
                alt={s.image.altEn}
                width={35}
                loading="lazy"
            />
        ));
    }, [project.skills]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-row items-center justify-between gap-1 space-y-0 p-3">
                <div>
                    <CardTitle className="leading-inherit flex items-center gap-1.5 truncate">
                        {project.title}
                        {project.featured && (
                            <Badge className="bg-danger/25 p-1.5 text-danger hover:bg-danger/25 focus:ring-0 focus:ring-offset-0">
                                <FaHeart size={14} />
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                        {dateFormatter.format(new Date(project.creationDate))}
                    </CardDescription>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <ProjectFormDialog
                            project={project}
                            trigger={
                                <TooltipTrigger asChild>
                                    <Button
                                        className="text-foreground-500 h-7 w-7"
                                        variant="outline"
                                        size="icon"
                                        disabled={isOptimistic}
                                    >
                                        <MdEdit size={18} />
                                    </Button>
                                </TooltipTrigger>
                            }
                        />
                        <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>
            <Separator />
            <CardContent className="flex grow flex-col justify-between gap-3 p-4">
                <p className="line-clamp-4">{project.descriptionEn}</p>
                <div>
                    <img
                        className="mx-auto aspect-[16/10] rounded-sm object-cover drop-shadow-lg"
                        src={
                            ImageService.getImageUrl(project.image, "projects") ??
                            PROJECT_PLACEHOLDER
                        }
                        alt={project.image.altEn}
                        width={512}
                        loading="lazy"
                    />
                    <div className="mt-3 flex justify-center gap-3">{skills}</div>
                </div>
            </CardContent>
        </Card>
    );
};
