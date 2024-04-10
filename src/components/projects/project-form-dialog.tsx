import { ProjectForm, type ProjectFormType } from "components/projects/project-form";
import { ResponsiveDrawerDialog } from "components/ui/responsive-drawer-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { useConfirmDialogContext } from "contexts/confirm-dialog-context";
import { type FC, type ReactNode, useState } from "react";
import type { FormState } from "react-hook-form";
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

    const formState: Pick<FormState<ProjectFormType>, "isDirty"> = {
        isDirty: false
    };

    const confirm = useConfirmDialogContext();

    return (
        <ResponsiveDrawerDialog
            trigger={
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>{props.trigger}</TooltipTrigger>
                        <TooltipContent>
                            {props.project ? "Edit project" : "Create project"}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            }
            header={{
                title: props.project ? `Editing ${props.project.title}` : "Creating project"
            }}
            content={
                <ProjectForm
                    project={props.project ?? null}
                    state={formState}
                    closeDialog={() => setOpen(false)}
                />
            }
            open={open}
            onOpenChange={async open => {
                if (!open && formState.isDirty) {
                    const title = props.project ? "Discard changes" : "Discard new project";
                    const confirmed = await confirm({
                        title,
                        body: props.project
                            ? "Are you sure you want to discard all changes to this project?"
                            : "Are you sure you want to discard this new project?",
                        confirmButton: title,
                        confirmDanger: true
                    });

                    if (!confirmed) return;
                }

                setOpen(open);
            }}
            classNames={{
                dialog: {
                    content: "max-w-xl"
                }
            }}
        />
    );
};
