import { useQueryClient } from "@tanstack/react-query";
import { ProjectService, SkillService } from "api/services";
import { AxiosError } from "axios";
import { Button, Input, Modal } from "components/common";
import { useCustomQuery } from "hooks/useCustomQuery";
import { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Project } from "types/entities";

import styles from "./project-form.module.scss";

type Props = {
    project?: Project;
    handleClose: () => void;
};

type ProjectWithFile = Project & { image: { file: FileList } };

export const ProjectForm: FC<Props> = ({ project: initialProject, handleClose }) => {

    const queryClient = useQueryClient();

    const [ isSubmitting, setIsSubmitting ] = useState(false);

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
        if (!isDirty) return handleClose();
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
                imageFile && await ProjectService.uploadImage(createdProject.id, imageFile);
            }

            await queryClient.invalidateQueries(["projects"]);
            console.log(`Project ${editing ? "updated" : "created"} successfully!`);
            handleClose();
            // showPopup({ title: "Project", message: `Project ${editing ? "updated" : "created"} successfully!` }, handleClose);
        } catch (e) {
            console.log(e);
            if (e instanceof AxiosError) {
                console.error("AxiosError", e);
                // showPopup({
                //     title: e.response?.data?.error ?? e.name,
                //     message: e.response?.data?.message ?? e.message
                // });
            } else {
                console.error("Unknown error", e);
                // showPopup({
                //     title: "Unknown error",
                //     message: "Please try again later."
                // });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title={initialProject ? `Editing ${initialProject.title}` : "Creating project"}
            handleClose={handleClose}
            config={{ outsideClick: false, escapeKey: true }}
        >
            <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
                <Input
                    attributes={{
                        ...register("title"),
                        className: styles.field,
                        required: true,
                        maxLength: 50
                    }}
                    label="Title"
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
                        className: styles.field,
                        required: true
                    }}
                    label="Creation date"
                />

                <Input
                    attributes={{
                        ...register("repoUrl"),
                        type: "url",
                        className: styles.field,
                        maxLength: 255,
                        required: true
                    }}
                    label="Repository URL"
                />

                <Input
                    attributes={{
                        ...register("demoUrl"),
                        type: "url",
                        className: styles.field,
                        maxLength: 255,
                        required: true
                    }}
                    label="Demonstration URL"
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
                        className: styles.field,
                        type: "file",
                        accept: "image/*",
                        required: !initialProject
                    }}
                    label="Image file"
                />

                <Input
                    attributes={{
                        ...register("image.alt"),
                        className: styles.field,
                        maxLength: 255,
                        required: true
                    }}
                    label="Image alt"
                />

                <Input
                    attributes={{
                        ...register("featured"),
                        type: "checkbox",
                        className: styles.field
                    }}
                    label="Featured"
                />

                <Button className={styles.submit} loading={isSubmitting}>Submit</Button>
            </form>
        </Modal>
    );
};
