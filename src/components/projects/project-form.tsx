import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "api/services/project";
import { ProjectFormFields } from "components/projects/project-form-fields";
import { Button } from "components/ui/button";
import { useConfirmDialogContext } from "contexts/confirm-dialog-context";
import { useFormState } from "hooks/use-form-state";
import { getDetail } from "libs/utils/error";
import type { FC } from "react";
import type { FormState, SubmitHandler } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import type {
    Project,
    ProjectCreation,
    ProjectCreationWithFile,
    ProjectEditionWithFile
} from "types/entities/project";
import {
    projectCreationWithFileSchema,
    projectEditionWithFileSchema
} from "types/entities/project";

export type ProjectFormType = ProjectCreationWithFile | ProjectEditionWithFile;

interface Props {
    project: Project | null;
    state: Pick<FormState<ProjectFormType>, "isDirty">;
    closeDialog: () => void;
}

export const ProjectForm: FC<Props> = props => {
    const confirm = useConfirmDialogContext();

    const queryClient = useQueryClient();

    const { isSubmitting, startSubmitting, endSubmitting } = useFormState();

    const form = useForm<ProjectFormType>({
        resolver: zodResolver(
            props.project !== null ? projectEditionWithFileSchema : projectCreationWithFileSchema
        ),
        defaultValues:
            props.project !== null
                ? {
                      ...props.project,
                      image: {
                          ...props.project.image,
                          file: undefined
                      }
                  }
                : {
                      title: "",
                      descriptionEn: "",
                      descriptionFr: "",
                      creationDate: undefined,
                      repoUrl: "",
                      demoUrl: "",
                      featured: false,
                      skills: [],
                      image: {
                          altEn: "",
                          altFr: "",
                          file: undefined
                      }
                  }
    });
    const {
        formState: { isDirty },
        handleSubmit
    } = form;
    props.state.isDirty = isDirty;

    const submitHandler: SubmitHandler<ProjectFormType> = async data => {
        if (isSubmitting) return;

        if (!isDirty) {
            props.closeDialog();
            return;
        }

        startSubmitting();

        const editing = !!props.project;

        const imageFile = data.image.file?.item(0);

        try {
            if (editing && "id" in data) {
                const project: Project = {
                    ...data,
                    image: {
                        id: data.image.id,
                        uuid: data.image.uuid,
                        altEn: data.image.altEn,
                        altFr: data.image.altFr
                    }
                };
                await ProjectService.update(project, imageFile);
            } else {
                const project: ProjectCreation = {
                    ...data,
                    image: {
                        altEn: data.image.altEn,
                        altFr: data.image.altFr
                    }
                };
                await ProjectService.create(project, imageFile);
            }

            await queryClient.invalidateQueries({
                queryKey: ["projects"]
            });

            props.closeDialog();
        } catch (e) {
            const message = editing ? "Project update failed:" : "Project creation failed:";
            toast.error(message + " " + getDetail(e));
            console.error(message, e);
        } finally {
            endSubmitting();
        }
    };

    const handleDelete = async () => {
        if (isSubmitting) return;

        if (!props.project) return;

        startSubmitting();

        const confirmed = await confirm({
            title: "Delete project",
            body: "Are you sure you want to delete this project?",
            confirmButton: "Delete",
            confirmDanger: true
        });

        if (!confirmed) {
            endSubmitting();
            return;
        }

        try {
            await ProjectService.delete(props.project.id);

            await queryClient.invalidateQueries({
                queryKey: ["projects"]
            });

            props.closeDialog();
        } catch (e) {
            const message = "Project deletion failed:";
            toast.error(message + " " + getDetail(e));
            console.error(message, e);
        } finally {
            endSubmitting();
        }
    };

    return (
        <FormProvider {...form}>
            <form
                className="mb-2 grid grid-cols-[1fr_1fr] gap-x-4 gap-y-3"
                onSubmit={handleSubmit(submitHandler)}
            >
                <ProjectFormFields />

                <div className="col-span-2 mt-3 flex w-full justify-center gap-4">
                    {!!props.project && (
                        <Button
                            className="grow"
                            variant="destructive"
                            disabled={isSubmitting}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    )}
                    <Button className="grow" type="submit" disabled={isSubmitting}>
                        Submit
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};
