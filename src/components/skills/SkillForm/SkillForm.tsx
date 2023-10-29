import { Button } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { SkillService } from "api/services";
import { Input, Modal } from "components/common";
import { ImageForm } from "components/image";
import { useFormSubmissionState } from "hooks/useFormSubmissionState";
import { getTitleAndMessage } from "libs/utils";
import type { FC } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { Skill, WithImageFile } from "types/entities";

import styles from "./skill-form.module.scss";

type SkillFormValues = WithImageFile<Skill>;

type Props = {
    skill?: Skill;
    numberOfSkills: number;
    handleClose: (isTouched: boolean, isDeleted: boolean) => void;
};

export const SkillForm: FC<Props> = ({ skill: initialSkill, numberOfSkills, handleClose }) => {

    const queryClient = useQueryClient();

    const [ submissionState, dispatchSubmissionState ] = useFormSubmissionState();

    const form = useForm<SkillFormValues>({ defaultValues: initialSkill });
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { isDirty }
    } = form;

    const [ oldName, setOldName ] = useState(initialSkill?.name ?? "");

    const submitHandler: SubmitHandler<SkillFormValues> = async data => {
        if (submissionState.isSubmittingEdition) return;
        if (!isDirty) return handleClose(false, false);
        dispatchSubmissionState("editionStarted");
        const editing = !!initialSkill;
        try {
            const skill: Skill = {
                ...data,
                image: {
                    id: data.image.id,
                    uuid: initialSkill?.image?.uuid,
                    altEn: data.image.altEn,
                    altFr: data.image.altFr
                }
            };
            if (!editing) {
                skill.sort = numberOfSkills + 1;
            }

            const imageFile = data.image.file.item(0);
            if (imageFile?.size && imageFile.size > 3 * 1024 * 1024) {
                toast.error("Image size cannot exceed 3MB");
                return;
            }

            if (editing) {
                await SkillService.update(skill, imageFile);
            } else {
                await SkillService.save(skill, imageFile);
            }

            await queryClient.invalidateQueries([ "skills" ]);
            console.log(`Skill ${editing ? "updated" : "created"} successfully!`);
            handleClose(true, false);
        } catch (e) {
            console.error(editing ? "Skill update failed" : "Skill creation failed", getTitleAndMessage(e));
        } finally {
            dispatchSubmissionState("editionFinished");
        }
    };

    const handleDelete = async () => {
        if (submissionState.isSubmittingDeletion) return;
        if (!initialSkill) return;
        dispatchSubmissionState("deletionStarted");
        try {
            await SkillService.delete(initialSkill.id);
            await queryClient.invalidateQueries([ "skills" ]);
            console.log("Skill deleted successfully!");
            handleClose(false, true);
        } catch (e) {
            console.error("Skill deletion failed", getTitleAndMessage(e));
        } finally {
            dispatchSubmissionState("deletionFinished");
        }
    };

    return (
        <Modal
            title={initialSkill ? `Editing ${initialSkill.name}` : "Creating skill"}
            handleClose={() => handleClose(false, false)}
            config={{ outsideClick: !isDirty, escapeKey: !isDirty }}
        >
            <FormProvider {...form}>
                <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
                    <Input
                        attributes={{
                            ...register("name", {
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
                            }),
                            required: true,
                            maxLength: 50
                        }}
                        label="Name"
                        wrapperClassName={styles.field}
                    />

                    <ImageForm inputsClassName={styles.field} />

                    <div className={styles.buttonsWrapper}>
                        {!!initialSkill && <Button loading={submissionState.isSubmittingDeletion} handleClick={handleDelete}>Delete</Button>}
                        <Button className={styles.submit} loading={submissionState.isSubmittingEdition}>Submit</Button>
                    </div>
                </form>
            </FormProvider>
        </Modal>
    );
};
