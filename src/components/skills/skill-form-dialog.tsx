import type { ProjectFormType } from "components/projects/project-form";
import { SkillForm } from "components/skills/skill-form";
import { ResponsiveDrawerDialog } from "components/ui/responsive-drawer-dialog";
import { useConfirmDialogContext } from "contexts/confirm-dialog-context";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import type { FormState } from "react-hook-form";

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

    const formState: Pick<FormState<ProjectFormType>, "isDirty"> = {
        isDirty: false
    };

    const confirm = useConfirmDialogContext();

    return (
        <ResponsiveDrawerDialog
            trigger={props.trigger}
            header={{
                title: props.skill ? `Editing ${props.skill.name}` : "Creating skill"
            }}
            content={
                <SkillForm
                    skill={props.skill ?? null}
                    state={formState}
                    closeDialog={() => setOpen(false)}
                />
            }
            open={open}
            onOpenChange={async open => {
                if (!open && formState.isDirty) {
                    const title = props.skill ? "Discard changes" : "Discard new skill";
                    const confirmed = await confirm({
                        title,
                        body: props.skill
                            ? "Are you sure you want to discard all changes to this skill?"
                            : "Are you sure you want to discard this new skill?",
                        confirmButton: title,
                        confirmDanger: true
                    });

                    if (!confirmed) return;
                }

                setOpen(open);
            }}
            classNames={{
                dialog: {
                    content: "max-w-md"
                }
            }}
        />
    );
};
