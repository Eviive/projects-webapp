import { useQueryClient } from "@tanstack/react-query";
import { ProjectService, SkillService } from "api/services";
import { Button, Input, Modal, Popup } from "components/common";
import { useCustomQuery } from "hooks/useCustomQuery";
import { usePopup } from "hooks/usePopup";
import { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Project } from "types/entities";
import { getTitleAndMessage } from "utils/errors";

import styles from "./project-form.module.scss";

type Props = {
    project?: Project;
    handleClose: (madeChanges: boolean) => void;
};

type ProjectWithFile = Project & { image: { file: FileList } };

export const ProjectForm: FC<Props> = ({ project: initialProject, handleClose }) => {

    const queryClient = useQueryClient();

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const [ popup, showPopup ] = usePopup();

    const query = useCustomQuery(["skills"], SkillService.findAll);

    const {
        register,
        handleSubmit,
        control,
        formState: { isDirty }
    } = useForm<ProjectWithFile>({ defaultValues: initialProject });

    const skillsOptions = query.data?.map(skill => ({ id: skill.id, label: skill.name, value: skill.id }));

    const submitHandler: SubmitHandler<ProjectWithFile> = async data => {
        if (isSubmitting) return;
        if (!isDirty) return handleClose(false);
        setIsSubmitting(true);
        try {
            const editing = !!initialProject;

            const project: Project = {
                ...data,
                image: {
                    id: data.image.id,
                    uuid: initialProject?.image?.uuid,
                    alt: data.image.alt
                }
            };
            const imageFile = data.image.file[0];

            if (editing) {
                const promises: Promise<Project>[] = [ProjectService.update(project)];
                imageFile && promises.push(ProjectService.uploadImage(project.id, imageFile));
                await Promise.all(promises);
            } else {
                const createdProject = await ProjectService.save(project);
                imageFile && await ProjectService.uploadImage(createdProject.id, imageFile); // TODO: make this into a single request using FormData and @RequestPart
            }

            await queryClient.invalidateQueries(["projects"]);
            console.log(`Project ${editing ? "updated" : "created"} successfully!`);
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
                title={initialProject ? `Editing ${initialProject.title}` : "Creating project"}
                handleClose={() => handleClose(false)}
                config={{ outsideClick: false, escapeKey: true }}
            >
                <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
                    <Input
                        attributes={{
                            ...register("title"),
                            required: true,
                            maxLength: 50
                        }}
                        label="Title"
                        wrapperClassName={styles.field}
                    />

                    <div className={styles.field}>
                        <label htmlFor="input-description">Description :</label>
                        <textarea
                            {...register("description")}
                            id="input-description"
                            rows={3}
                            maxLength={510}
                            required
                        ></textarea>
                    </div>

                    <Input
                        attributes={{
                            ...register("creationDate"),
                            type: "date",
                            required: true
                        }}
                        label="Creation date"
                        wrapperClassName={styles.field}
                    />

                    <Input
                        attributes={{
                            ...register("repoUrl"),
                            type: "url",
                            maxLength: 255,
                            required: true
                        }}
                        label="Repository URL"
                        wrapperClassName={styles.field}
                    />

                    <Input
                        attributes={{
                            ...register("demoUrl"),
                            type: "url",
                            maxLength: 255,
                            required: true
                        }}
                        label="Demonstration URL"
                        wrapperClassName={styles.field}
                    />

                    <div className={styles.field}>
                        <label htmlFor="input-skills">Skills :</label>
                        <Controller
                            control={control}
                            name={"skills"}
                            render={({ field }) => (
                                <Select
                                    ref={field.ref}
                                    options={skillsOptions}
                                    components={makeAnimated()}
                                    placeholder={""}
                                    value={skillsOptions?.filter(option => field.value?.map(s => s.id)?.includes(option.id))}
                                    onChange={v => {
                                        const selectedIds = [...v.values()].map(s => s.id);
                                        field.onChange(query.data?.filter(s => selectedIds.includes(s.id)));
                                    }}
                                    isLoading={query.isLoading}
                                    isDisabled={query.isLoading || query.isError}
                                    isMulti
                                    required
                                />
                            )}
                        />
                    </div>

                    <Input
                        attributes={{
                            ...register("image.file"),
                            type: "file",
                            accept: "image/*",
                            required: !initialProject
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

                    <Input
                        attributes={{
                            ...register("featured"),
                            type: "checkbox"
                        }}
                        label="Featured"
                        wrapperClassName={styles.field}
                    />

                    <Button className={styles.submit} loading={isSubmitting}>Submit</Button>
                </form>
            </Modal>
            <Popup {...popup} />
        </>
    );
};
