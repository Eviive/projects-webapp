import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { SkillService } from "api/services/skill";
import { SkillFormFields } from "components/skills/skill-form-fields";
import { Button } from "components/ui/button";
import { useConfirmDialogContext } from "contexts/confirm-dialog-context";
import { useFormState } from "hooks/use-form-state";
import { getDetail } from "libs/utils/error";
import type { FC } from "react";
import type { FormState, SubmitHandler } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import type {
    Skill,
    SkillCreation,
    SkillCreationWithFile,
    SkillEditionWithFile
} from "types/entities/skill";
import { skillCreationWithFileSchema, skillEditionWithFileSchema } from "types/entities/skill";

export type SkillFormType = SkillCreationWithFile | SkillEditionWithFile;

type Props = {
    skill: Skill | null;
    state: Pick<FormState<SkillFormType>, "isDirty">;
    closeDialog: () => void;
};

export const SkillForm: FC<Props> = props => {
    const confirm = useConfirmDialogContext();

    const queryClient = useQueryClient();

    const { isSubmitting, startSubmitting, endSubmitting } = useFormState();

    const form = useForm<SkillFormType>({
        resolver: zodResolver(
            props.skill !== null ? skillEditionWithFileSchema : skillCreationWithFileSchema
        ),
        defaultValues:
            props.skill !== null
                ? {
                      ...props.skill,
                      image: {
                          ...props.skill.image,
                          file: undefined
                      }
                  }
                : {
                      name: "",
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

    const submitHandler: SubmitHandler<SkillFormType> = async data => {
        if (isSubmitting) return;

        if (!isDirty) return props.closeDialog();

        startSubmitting();

        const editing = !!props.skill;

        const imageFile = data.image.file?.item(0);

        try {
            if (editing && "id" in data) {
                const skill: Skill = {
                    ...data,
                    image: {
                        id: data.image.id,
                        uuid: data.image.uuid,
                        altEn: data.image.altEn,
                        altFr: data.image.altFr
                    }
                };
                await SkillService.update(skill, imageFile);
            } else {
                const skill: SkillCreation = {
                    ...data,
                    image: {
                        altEn: data.image.altEn,
                        altFr: data.image.altFr
                    }
                };
                await SkillService.save(skill, imageFile);
            }

            await queryClient.invalidateQueries({
                queryKey: ["skills"]
            });

            props.closeDialog();
        } catch (e) {
            console.error(
                editing ? "Skill update failed:" : "Skill creation failed:",
                getDetail(e)
            );
        } finally {
            endSubmitting();
        }
    };

    const handleDelete = async () => {
        if (isSubmitting) return;

        if (!props.skill) return;

        startSubmitting();

        const confirmed = await confirm({
            title: "Delete skill",
            body: "Are you sure you want to delete this skill?",
            confirmButton: "Delete",
            confirmDanger: true
        });

        if (!confirmed) return endSubmitting();

        try {
            await SkillService.delete(props.skill.id);

            await queryClient.invalidateQueries({
                queryKey: ["skills"]
            });

            props.closeDialog();
        } catch (e) {
            console.error("Skill deletion failed:", getDetail(e));
        } finally {
            endSubmitting();
        }
    };

    return (
        <FormProvider {...form}>
            <form className="mb-2 flex flex-col gap-4" onSubmit={handleSubmit(submitHandler)}>
                <SkillFormFields />

                <div className="flex w-full justify-center gap-3">
                    {!!props.skill && (
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
