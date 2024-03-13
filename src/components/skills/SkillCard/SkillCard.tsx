import { ImageService } from "api/services";
import { SkillFormDialog } from "components/skills/SkillFormModal/SkillFormDialog";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { SKILL_PLACEHOLDER } from "lib/constants";
import type { FC } from "react";
import { MdEdit } from "react-icons/md";

import type { Skill } from "types/entities/skill";

type Props = {
    skill: Skill;
    isOptimistic?: boolean;
};

export const SkillCard: FC<Props> = ({ skill, isOptimistic }) => {
    return (
        <Card className="justify-self-stretch">
            <CardHeader className="p-3">
                <CardTitle className="text-sm flex items-center justify-between gap-2">
                    <span className="max-w-[calc(100% - 36px)] truncate">
                        {skill.name}
                    </span>
                    <TooltipProvider>
                        <Tooltip>
                            <SkillFormDialog
                                skill={skill}
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
                            <TooltipContent>
                                Edit
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 flex justify-center items-center">
                <img
                    className="object-cover aspect-square drop-shadow-[0_1px_1px_hsl(0deg,0%,0%,0.5)]"
                    src={ImageService.getImageUrl(skill.image) ?? SKILL_PLACEHOLDER}
                    alt={skill.image.altEn}
                    width={100}
                    loading="lazy"
                />
            </CardContent>
        </Card>
    );
};
