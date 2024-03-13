import { SkillForm } from "components/skills";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "components/ui/dialog";
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

    const [ open, setOpen ] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{props.trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{props.skill ? `Editing ${props.skill.name}` : "Creating skill"}</DialogTitle>
                </DialogHeader>
                <SkillForm skill={props.skill ?? null} closeDialog={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};
