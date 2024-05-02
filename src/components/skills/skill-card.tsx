import { RequireAuthority } from "components/common/require-authority";
import { SkillFormDialog } from "components/skills/skill-form-dialog";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { SKILL_PLACEHOLDER } from "libs/constants";
import { getImageUrl } from "libs/image";
import type { FC } from "react";
import { MdEdit } from "react-icons/md";

import type { Skill } from "types/entities/skill";

type Props = {
    skill: Skill;
    isOptimistic?: boolean;
};

export const SkillCard: FC<Props> = ({ skill, isOptimistic }) => {
    return (
        <li className="self-stretch justify-self-stretch">
            <Card className="h-full w-full">
                <CardHeader className="flex-row items-center justify-between gap-1 space-y-0 p-3">
                    <CardTitle className="max-w-[calc(100% - 36px)] truncate text-sm">
                        {skill.name}
                    </CardTitle>
                    <RequireAuthority authority={["update:skill", "delete:skill"]}>
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
                                <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </RequireAuthority>
                </CardHeader>
                <Separator />
                <CardContent className="flex items-center justify-center p-4">
                    <img
                        className="aspect-square object-cover drop-shadow-icon"
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
