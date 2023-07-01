import { useQueryClient } from "@tanstack/react-query";
import { SkillService } from "api/services";
import { Button, Input, Modal, Popup } from "components/common";
import { usePopup } from "hooks/usePopup";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Skill } from "types/entities";
import { getTitleAndMessage } from "utils/errors";

import styles from "./skill-form.module.scss";

type Props = {
    skill?: Skill;
    handleClose: (madeChanges: boolean) => void;
};

type SkillWithFile = Skill & { image: { file: FileList } };

export const SkillForm: FC<Props> = ({ skill: initialSkill, handleClose }) => {

    const queryClient = useQueryClient();

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const [ popup, showPopup ] = usePopup();

    const {
        register,
        handleSubmit,
        formState: { isDirty }
    } = useForm<SkillWithFile>({ defaultValues: initialSkill });

    const submitHandler: SubmitHandler<SkillWithFile> = async data => {
        if (isSubmitting) return;
        if (!isDirty) return handleClose(false);
        setIsSubmitting(true);
        try {
            const editing = !!initialSkill;

            const skill: Skill = {
                ...data,
                image: {
                    id: data.image.id,
                    uuid: initialSkill?.image?.uuid,
                    alt: data.image.alt
                }
            };
            const imageFile = data.image.file[0];

            if (editing) {
                const promises: Promise<Skill>[] = [SkillService.update(skill)];
                imageFile && promises.push(SkillService.uploadImage(skill.id, imageFile));
                await Promise.all(promises);
            } else {
                const createSkill = await SkillService.save(skill);
                imageFile && await SkillService.uploadImage(createSkill.id, imageFile); // TODO: make this into a single request using FormData and @RequestPart
            }

            await queryClient.invalidateQueries(["skills"]);
            console.log(`Skill ${editing ? "updated" : "created"} successfully!`);
            handleClose(true);
        } catch (e) {
            showPopup(getTitleAndMessage(e));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Modal
                title={initialSkill ? `Editing ${initialSkill.name}` : "Creating skill"}
                handleClose={() => handleClose(false)}
                config={{ outsideClick: false, escapeKey: true }}
            >
                <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
                    <Input
                        attributes={{
                            ...register("name"),
                            required: true,
                            maxLength: 50
                        }}
                        label="Name"
                        wrapperClassName={styles.field}
                    />

                    <Input
                        attributes={{
                            ...register("image.file"),
                            type: "file",
                            accept: "image/*",
                            required: !initialSkill
                        }}
                        label="Image file"
                        wrapperClassName={styles.field}
                    />

                    <Input
                        attributes={{
                            ...register("image.alt"),
                            maxLength: 255,
                            required: true
                        }}
                        label="Image alt"
                        wrapperClassName={styles.field}
                    />

                    <Button className={styles.submit} loading={isSubmitting}>Submit</Button>
                </form>
            </Modal>
            <Popup {...popup} />
        </>
    );
};
