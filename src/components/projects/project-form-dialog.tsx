import { ProjectForm } from "components/projects/project-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "components/ui/dialog";
import { type FC, type ReactNode, useState } from "react";
import type { Project } from "types/entities/project";

type EditionProps = {
    project: Project;
};

type CreationProps = {
    project?: never;
};

type Props = {
    trigger: ReactNode;
} & (EditionProps | CreationProps);

export const ProjectFormDialog: FC<Props> = props => {

    const [ open, setOpen ] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{props.trigger}</DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{props.project ? `Editing ${props.project.title}` : "Creating project"}</DialogTitle>
                </DialogHeader>
                <ProjectForm project={props.project ?? null} closeDialog={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};
