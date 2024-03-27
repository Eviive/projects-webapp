import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { SkillService } from "api/services/skill";
import { ImageForm } from "components/image/image-form";
import { Button } from "components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import { useConfirmDialogContext } from "contexts/confirm-dialog-context";
import { useFormSubmissionState } from "hooks/use-form-submission-state";
import { getFormattedTitleAndMessage } from "lib/utils/error";
import type { FC } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import type { Skill, SkillCreation, SkillCreationWithFile, SkillEditionWithFile } from "types/entities/skill";
import { skillCreationSchema, skillEditionWithFileSchema } from "types/entities/skill";

type SkillForm = SkillCreationWithFile | SkillEditionWithFile;

type Props = {
    skill: Skill | null;
    closeDialog: () => void;
};

export const SkillForm: FC<Props> = props => {

    const confirm = useConfirmDialogContext();

    const queryClient = useQueryClient();

    const [ submissionState, dispatchSubmissionState ] = useFormSubmissionState();

    const form = useForm<SkillForm>({
        resolver: zodResolver(
            props.skill === null
                ? skillCreationSchema
                : skillEditionWithFileSchema
        ),
        defaultValues: props.skill ?? {
            name: "",
            image: {
                altEn: "",
                altFr: ""
            }
        }
    });
    const {
        formState: {
            isDirty
        },
        control,
        getValues,
        setValue,
        handleSubmit
    } = form;

    const [ oldName, setOldName ] = useState(getValues("name"));

    const submitHandler: SubmitHandler<SkillForm> = async data => {
        if (submissionState.isSubmittingEdition || submissionState.isSubmittingDeletion) return;

        if (!isDirty) return props.closeDialog();

        dispatchSubmissionState("editionStarted");

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
                queryKey: [ "skills" ]
            });

            props.closeDialog();
        } catch (e) {
            console.error(editing ? "Skill update failed" : "Skill creation failed", getFormattedTitleAndMessage(e));
        } finally {
            dispatchSubmissionState("editionFinished");
        }
    };

    const handleDelete = async () => {
        if (submissionState.isSubmittingDeletion || submissionState.isSubmittingEdition) return;

        if (!props.skill) return;

        dispatchSubmissionState("deletionStarted");

        const confirmed = await confirm({
            title: "Delete skill",
            body: "Are you sure you want to delete this skill?",
            confirmButton: "Delete"
        });

        if (!confirmed) return dispatchSubmissionState("deletionFinished");

        try {
            await SkillService.delete(props.skill.id);

            await queryClient.invalidateQueries({
                queryKey: [ "skills" ]
            });

            props.closeDialog();
        } catch (e) {
            console.error("Skill deletion failed", getFormattedTitleAndMessage(e));
        } finally {
            dispatchSubmissionState("deletionFinished");
        }
    };

    return (
        <FormProvider {...form}>
            <form
                className="mb-2 flex flex-col gap-4"
                onSubmit={handleSubmit(submitHandler)}
            >
                <FormField
                    control={control}
                    name="name"
                    rules={{
                        onChange: () => {
                            const [ name, altEn, altFr ] = getValues([ "name", "image.altEn", "image.altFr" ]),
                                  isNameEmpty = !name.trim(),
                                  isAltEnEmpty = !altEn.trim(),
                                  isAltFrEmpty = !altFr.trim(),
                                  isAltEnFormatted = altEn === `${oldName.trim()}'s logo`,
                                  isAltFrFormatted = altFr === `Logo de ${oldName.trim()}`;

                            (isAltEnEmpty || isAltEnFormatted) && setValue("image.altEn", isNameEmpty ? "" : `${name.trim()}'s logo`);
                            (isAltFrEmpty || isAltFrFormatted) && setValue("image.altFr", isNameEmpty ? "" : `Logo de ${name.trim()}`);

                            setOldName(name);
                        }
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <ImageForm />

                <div className="w-full flex justify-center gap-3">
                    {!!props.skill && (
                        <Button
                            className="w-full max-w-[50%]"
                            variant="destructive"
                            disabled={submissionState.isSubmittingEdition || submissionState.isSubmittingDeletion}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    )}
                    <Button
                        className="w-full max-w-[50%]"
                        type="submit"
                        disabled={submissionState.isSubmittingEdition || submissionState.isSubmittingDeletion}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};
