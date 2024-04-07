import { ProjectForm } from "components/projects/project-form";
import { ResponsiveDrawerDialog } from "components/ui/responsive-drawer-dialog";
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
    const [open, setOpen] = useState(false);

    return (
        <ResponsiveDrawerDialog
            trigger={props.trigger}
            header={{
                title: props.project ? `Editing ${props.project.title}` : "Creating project"
            }}
            content={
                <ProjectForm project={props.project ?? null} closeDialog={() => setOpen(false)} />
            }
            open={open}
            onOpenChange={setOpen}
            classNames={{
                dialog: {
                    content: "max-w-xl"
                }
            }}
        />
    );
};
