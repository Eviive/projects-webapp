import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectService, SkillService } from "api/services";
import { Button, Input, Modal } from "components/common";
import { useFormSubmissionState } from "hooks/useFormSubmissionState";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import type { Project } from "types/entities";
import { getTitleAndMessage } from "utils/errors";

import styles from "./project-form.module.scss";

type Props = {
    project?: Project;
    numberOfProjects: number;
    handleClose: (isTouched: boolean, isDeleted: boolean) => void;
};

type ProjectWithFile = Project & { image: { file: FileList } };

export const ProjectForm: FC<Props> = ({ project: initialProject, numberOfProjects, handleClose }) => {

    const queryClient = useQueryClient();

    const [ submissionState, dispatchSubmissionState ] = useFormSubmissionState();

    const query = useQuery([ "skills" ], SkillService.findAll);

    const {
        register,
        handleSubmit,
        control,
        getValues,
        setValue,
        formState: { isDirty }
    } = useForm<ProjectWithFile>({ defaultValues: initialProject });

    const skillsOptions = query.data
        ?.sort((a, b) => a.sort - b.sort)
        ?.map(skill => ({ id: skill.id, label: skill.name, value: skill.id }));

    const submitHandler: SubmitHandler<ProjectWithFile> = async data => {
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
            <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
                <Input
                    attributes={{
                        ...register("title", {
                            onChange: () => {
                                if (!getValues("title") || getValues("title").trim().length === 0) {
                                    getValues("image.altEn") || setValue("image.altEn", "");
                                    getValues("image.altFr") || setValue("image.altFr", "");
                                } else {
                                    getValues("image.altEn") || setValue("image.altEn", `The ${getValues("title")}'s UI`);
                                    getValues("image.altFr") || setValue("image.altFr", `L'UI de ${getValues("title")}`);
                                }
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

                <Input
                    attributes={{
                        ...register("image.file"),
                        type: "file",
                        accept: "image/*"
                    }}
                    label="Image file"
                    wrapperClassName={styles.field}
                />

                <Input
                    attributes={{
                        ...register("image.altEn"),
                        maxLength: 255,
                        required: true
                    }}
                    label="Image english alt"
                    wrapperClassName={styles.field}
                />

                <Input
                    attributes={{
                        ...register("image.altFr"),
                        maxLength: 255,
                        required: true
                    }}
                    label="Image french alt"
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

                <div className={styles.buttonsWrapper}>
                    {!!initialProject && <Button loading={submissionState.isSubmittingDeletion} handleClick={handleDelete}>Delete</Button>}
                    <Button className={styles.submit} loading={submissionState.isSubmittingEdition}>Submit</Button>
                </div>
            </form>
        </Modal>
    );
};
