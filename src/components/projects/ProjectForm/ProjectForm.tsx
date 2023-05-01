import { useQueryClient } from "@tanstack/react-query";
import { SkillService } from "api/services";
import { Button, Input, Modal } from "components/common";
import { useCustomQuery } from "hooks/useCustomQuery";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Project } from "types/entities";

import styles from "./project-form.module.scss";

type Props = {
    project?: Project;
    handleClose: () => void;
};

export const ProjectForm: FC<Props> = ({ project, handleClose }) => {

    const queryClient = useQueryClient();

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const { data: skills } = useCustomQuery([ "skills" ], SkillService.findAll);

    const { register, handleSubmit, setValue } = useForm<Project>({ defaultValues: project });

    const skillsOptions = skills?.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>);

    const submitHandler: SubmitHandler<Project> = async data => {
        console.log(data);
        // setIsSubmitting(true);
        // try {
        // 	const editing = !!project;

        // 	editing ? await updateProject(data) : await saveProject(data);

        // 	queryClient.invalidateQueries(["projects"]);
        // 	showPopup({ title: "Project", message: `Project ${editing ? "updated" : "created"} successfully!` }, handleClose);
        // } catch (e) {
        // 	console.log(e);
        // 	if (e instanceof AxiosError) {
        // 		showPopup({
        // 			title: e.response?.data?.error ?? e.name,
        // 			message: e.response?.data?.message ?? e.message
        // 		});
        // 	} else {
        // 		showPopup({
        // 			title: "Unknown error",
        // 			message: "Please try again later."
        // 		});
        // 	}
        // } finally {
        // 	setIsSubmitting(false);
        // }
    };

    // const selectChangeHandler: ChangeEventHandler<HTMLSelectElement> = e => {
    //     const { options } = e.target;
    //     const selectedSkills: Skill[] = [];
    //
    //     for (const o of options) {
    //         if (o.selected) {
    //             const skill = skills?.find(s => s.id === parseInt(o.value));
    //
    //             if (skill) {
    //                 selectedSkills.push(skill);
    //             }
    //         }
    //     }
    //
    //     setValue("skills", selectedSkills);
    // };

    return (
        <Modal
            title={project ? `Editing ${project.title}` : "Creating project"}
            handleClose={handleClose}
            config={{ outsideClick: false, escapeKey: true }}
        >
            <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
                <Input
                    attributes={{
                        ...register("title", { required: true }),
                        className: styles.field
                    }}
                    label="Title"
                />

                <div className={styles.field}>
                    <label htmlFor="input-description">Description :</label>
                    <textarea
                        {...register("description", { required: true })}
                        id="input-description"
                        rows={3}
                    ></textarea>
                </div>

                <Input
                    attributes={{
                        ...register("creationDate", { required: true }),
                        type: "date",
                        className: styles.field
                    }}
                    label="Creation date"
                />

                <Input
                    attributes={{
                        ...register("repoUrl", { required: true }),
                        type: "url",
                        className: styles.field
                    }}
                    label="Repository URL"
                />

                <Input
                    attributes={{
                        ...register("demoUrl", { required: true }),
                        type: "url",
                        className: styles.field
                    }}
                    label="Demonstration URL"
                />

                <div className={styles.field}>
                    <label htmlFor="input-skills">Skills :</label>
                    <select
                        {...register("skills", {
                            required: true
                        })}
                        // onChange={selectChangeHandler}
                        id="input-skills"
                        multiple
                    >
                        {skillsOptions}
                    </select>
                </div>

                <Input
                    attributes={{
                        ...register("image.alt", { required: true }),
                        className: styles.field
                    }}
                    label="Image alt"
                />

                <Input
                    attributes={{
                        ...register("image.alt", { required: false }),
                        className: styles.field,
                        type: "file",
                        accept: "image/*",
                        required: !project
                    }}
                    label="Image preview"
                />

                <Input
                    attributes={{
                        ...register("featured", { required: true }),
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
