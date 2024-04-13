import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "api/services/project";
import { ProjectFormFields } from "components/projects/project-form-fields";
import { Button } from "components/ui/button";
import { useConfirmDialogContext } from "contexts/confirm-dialog-context";
import { useFormState } from "hooks/use-form-state";
import { getDetail } from "libs/utils/error";
import type { FC } from "react";
import { FormProvider, type FormState, type SubmitHandler, useForm } from "react-hook-form";
import type {
    Project,
    ProjectCreation,
    ProjectCreationWithFile,
    ProjectEditionWithFile
} from "types/entities/project";
import { projectCreationSchema, projectEditionWithFileSchema } from "types/entities/project";

export type ProjectFormType = ProjectCreationWithFile | ProjectEditionWithFile;

type Props = {
    project: Project | null;
    state: Pick<FormState<ProjectFormType>, "isDirty">;
    closeDialog: () => void;
};

export const ProjectForm: FC<Props> = props => {
    const confirm = useConfirmDialogContext();

    const queryClient = useQueryClient();

    const { isSubmitting, startSubmitting, endSubmitting } = useFormState();

    const form = useForm<ProjectFormType>({
        resolver: zodResolver(
            props.project !== null ? projectEditionWithFileSchema : projectCreationSchema
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

        if (!isDirty) return props.closeDialog();

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
                await ProjectService.save(project, imageFile);
            }

            await queryClient.invalidateQueries({
                queryKey: ["projects"]
            });

            props.closeDialog();
        } catch (e) {
            console.error(
                editing ? "Project update failed:" : "Project creation failed:",
                getDetail(e)
            );
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

        if (!confirmed) return endSubmitting();

        try {
            await ProjectService.delete(props.project.id);

            await queryClient.invalidateQueries({
                queryKey: ["projects"]
            });

            props.closeDialog();
        } catch (e) {
            console.error("Project deletion failed:", getDetail(e));
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
                            className="w-full max-w-[50%]"
                            variant="destructive"
                            disabled={isSubmitting}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    )}
                    <Button className="w-full max-w-[50%]" type="submit" disabled={isSubmitting}>
                        Submit
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};
