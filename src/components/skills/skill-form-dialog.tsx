import { SkillForm } from "components/skills/skill-form";
import { ResponsiveDrawerDialog } from "components/ui/responsive-drawer-dialog";
import type { FC, ReactNode } from "react";
import { useState } from "react";

import type { Skill } from "types/entities/skill";

type EditionProps = {
    skill: Skill;
};

type CreationProps = {
    skill?: never;
};

type Props = {
    trigger: ReactNode;
} & (EditionProps | CreationProps);

export const SkillFormDialog: FC<Props> = props => {
    const [open, setOpen] = useState(false);

    return (
        <ResponsiveDrawerDialog
            trigger={props.trigger}
            header={{
                title: props.skill ? `Editing ${props.skill.name}` : "Creating skill"
            }}
            content={<SkillForm skill={props.skill ?? null} closeDialog={() => setOpen(false)} />}
            open={open}
            onOpenChange={setOpen}
            classNames={{
                dialog: {
                    content: "max-w-md"
                }
            }}
        />
    );
};
