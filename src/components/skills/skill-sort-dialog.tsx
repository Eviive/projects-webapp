import { type MutationKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageService } from "api/services/image";
import { SkillService } from "api/services/skill";
import { SortDialog } from "components/common/sort-dialog";
import { SKILL_PLACEHOLDER } from "lib/constants";
import type { FC, ReactNode } from "react";
import type { Skill } from "types/entities/skill";

export const sortSkillsMutationKey = [ "sortSkills" ] as const satisfies MutationKey;

type Props = {
    initialSkills: Skill[] | null;
    trigger: ReactNode;
};

export const SkillSortDialog: FC<Props> = props => {

    const queryClient = useQueryClient();

    const sortSkillsMutation = useMutation({
        mutationFn: SkillService.sort,
        onSettled: () => queryClient.invalidateQueries({ queryKey: [ "skills" ] }),
        mutationKey: sortSkillsMutationKey
    });

    return (
        <SortDialog
            itemsName="skills"
            trigger={props.trigger}
            initialItems={props.initialSkills}
            mutation={sortSkillsMutation}
            render={skill => (
                <div className="grow flex items-center gap-3">
                    <img
                        className="object-cover aspect-square drop-shadow-[0_1px_1px_hsl(0deg,0%,0%,0.5)]"
                        src={ImageService.getImageUrl(skill.image, "skills") ?? SKILL_PLACEHOLDER}
                        alt={skill.image.altEn}
                        width={36}
                        loading="lazy"
                    />
                    {skill.name}
                </div>
            )}
        />
    );
};
