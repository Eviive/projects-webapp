import { RequireAuthority } from "components/common/require-authority";
import { SkillFormDialog } from "components/skills/skill-form-dialog";
import { Button } from "components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { SKILL_PLACEHOLDER } from "libs/constants";
import { getImageUrl } from "libs/image";
import type { FC } from "react";
import { MdEdit } from "react-icons/md";

import type { Skill } from "types/entities/skill";

interface Props {
    skill: Skill;
    isOptimistic?: boolean;
}

export const SkillCard: FC<Props> = ({ skill, isOptimistic }) => {
    return (
        <li className="self-stretch justify-self-stretch">
            <Card className="size-full gap-4 py-4">
                <CardHeader className="flex flex-row items-center justify-between px-4">
                    <CardTitle className="truncate text-sm">{skill.name}</CardTitle>
                    <RequireAuthority authority={["update:skill", "delete:skill"]}>
                        <CardAction>
                            <TooltipProvider>
                                <Tooltip>
                                    <SkillFormDialog
                                        skill={skill}
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
                        </CardAction>
                    </RequireAuthority>
                </CardHeader>
                <Separator />
                <CardContent className="flex items-center justify-center px-4">
                    <img
                        className="drop-shadow-icon aspect-square object-cover"
                        src={getImageUrl(skill.image, "skills") ?? SKILL_PLACEHOLDER}
                        alt={skill.image.altEn}
                        width={100}
                        loading="lazy"
                    />
                </CardContent>
            </Card>
        </li>
    );
};
