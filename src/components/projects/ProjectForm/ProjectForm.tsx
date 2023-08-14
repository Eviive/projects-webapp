import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectService, SkillService } from "api/services";
import { Button, Input, Modal } from "components/common";
import { ImageForm } from "components/image";
import { useFormSubmissionState } from "hooks/useFormSubmissionState";
import { getTitleAndMessage } from "libs/utils";
import type { FC } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import type { Project, WithImageFile } from "types/entities";

import styles from "./project-form.module.scss";

type ProjectFormValues = WithImageFile<Project>;

type Props = {
    project?: Project;
    numberOfProjects: number;
    handleClose: (isTouched: boolean, isDeleted: boolean) => void;
};

export const ProjectForm: FC<Props> = ({ project: initialProject, numberOfProjects, handleClose }) => {

    const queryClient = useQueryClient();

    const [ submissionState, dispatchSubmissionState ] = useFormSubmissionState();

    const query = useQuery([ "skills" ], SkillService.findAll);

    const form = useForm<ProjectFormValues>({ defaultValues: initialProject });
    const {
        register,
        handleSubmit,
        control,
        getValues,
        setValue,
        formState: { isDirty }
    } = form;

    const [ oldTitle, setOldTitle ] = useState(initialProject?.title ?? "");

    const skillsOptions = query.data
        ?.sort((a, b) => a.sort - b.sort)
        ?.map(skill => ({ id: skill.id, label: skill.name, value: skill.id }));

    const submitHandler: SubmitHandler<ProjectFormValues> = async data => {
        if (submissionState.isSubmittingEdition) return;
        if (!isDirty) return handleClose(false, false);
        dispatchSubmissionState("editionStarted");
        const editing = !!initialProject;
        try {
            const project: Project = {
                ...data,
                image: {
                    id: data.image.id,
                    uuid: initialProject?.image?.uuid,
                    altEn: data.image.altEn,
                    altFr: data.image.altFr
                }
            };
            if (!editing) {
                project.sort = numberOfProjects + 1;
            }

            const imageFile = data.image.file.item(0);
            if (imageFile?.size && imageFile?.size > 3 * 1024 * 1024) {
                toast.error("Image size cannot exceed 3MB");
                return;
            }

            if (editing) {
                await ProjectService.update(project, imageFile);
            } else {
                await ProjectService.save(project, imageFile);
            }

            await queryClient.invalidateQueries([ "projects" ]);
            console.log(`Project ${editing ? "updated" : "created"} successfully!`);
            handleClose(true, false);
        } catch (e) {
            console.error(editing ? "Project update failed" : "Project creation failed", getTitleAndMessage(e));
        } finally {
            dispatchSubmissionState("editionFinished");
        }
    };

    const handleDelete = async () => {
        if (submissionState.isSubmittingDeletion) return;
        if (!initialProject) return;
        dispatchSubmissionState("deletionStarted");
        try {
            await ProjectService.delete(initialProject.id);
            await queryClient.invalidateQueries([ "projects" ]);
            console.log("Project deleted successfully!");
            handleClose(false, true);
        } catch (e) {
            console.error("Project deletion failed", getTitleAndMessage(e));
        } finally {
            dispatchSubmissionState("deletionFinished");
        }
    };

    return (
        <Modal
            title={initialProject ? `Editing ${initialProject.title}` : "Creating project"}
            handleClose={() => handleClose(false, false)}
            config={{ outsideClick: false, escapeKey: true }}
        >
            <FormProvider {...form}>
                <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
                    <Input
                        attributes={{
                            ...register("title", {
                                onChange: () => {
                                    const [ title, altEn, altFr ] = getValues([ "title", "image.altEn", "image.altFr" ]),
                                          isTitleEmpty = !title.trim(),
                                          isOldTitleEmpty = !oldTitle.trim(),
                                          isAltEnEmpty = !altEn.trim(),
                                          isAltFrEmpty = !altFr.trim(),
                                          isAltEnFormatted = altEn.trim() === (isOldTitleEmpty ? "" : `The ${oldTitle}'s UI`),
                                          isAltFrFormatted = altFr.trim() === (isOldTitleEmpty ? "" : `L'UI de ${oldTitle}`);

                                    (isAltEnEmpty || isAltEnFormatted) && setValue("image.altEn", isTitleEmpty ? "" : `The ${title}'s UI`);
                                    (isAltFrEmpty || isAltFrFormatted) && setValue("image.altFr", isTitleEmpty ? "" : `L'UI de ${title}`);

                                    setOldTitle(title);
                                }
                            }),
                            required: true,
                            maxLength: 50
                        }}
                        label="Title"
                        wrapperClassName={styles.field}
                    />

                    <div className={styles.field}>
                        <label htmlFor="input-description">Description :</label>
                        <textarea
                            {...register("descriptionEn")}
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
                        <label>Skills :</label>
                        <Controller
                            control={control}
                            name="skills"
                            render={({ field }) => (
                                <Select
                                    ref={field.ref}
                                    placeholder=""
                                    options={skillsOptions}
                                    components={makeAnimated()}
                                    value={skillsOptions?.filter(option => field.value?.map(s => s.id)?.includes(option.id))}
                                    onChange={v => {
                                        const selectedIds = [ ...v.values() ].map(s => s.id);
                                        field.onChange(query.data?.filter(s => selectedIds.includes(s.id)) ?? []);
                                    }}
                                    isLoading={query.isLoading}
                                    isDisabled={query.isLoading || query.isError}
                                    isMulti
                                    required
                                />
                            )}
                        />
                    </div>

                    <ImageForm inputsClassName={styles.field} />

                    <Input
                        attributes={{
                            ...register("featured"),
                            type: "checkbox"
                        }}
                        label="Featured"
                        wrapperClassName={styles.field}
                    />

                    <div className={styles.buttonsWrapper}>
                        {!!initialProject && <Button loading={submissionState.isSubmittingDeletion} handleClick={handleDelete}>Delete</Button>}
                        <Button className={styles.submit} loading={submissionState.isSubmittingEdition}>Submit</Button>
                    </div>
                </form>
            </FormProvider>
        </Modal>
    );
};
