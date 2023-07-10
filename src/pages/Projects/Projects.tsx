import { useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "api/services";
import { Loader, Page, SortableList, Toolbar } from "components/common";
import { ProjectCard, ProjectForm } from "components/projects";
import { useCustomQuery } from "hooks/useCustomQuery";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsCheckLg } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { RxDragHandleDots2 } from "react-icons/rx";
import { DndState } from "types/app";
import { Project } from "types/entities";
import { getTitleAndMessage } from "../../utils/errors";

import styles from "./projects.module.scss";

type ProjectForm = {
    project?: Project;
    show: boolean;
};

export const Projects: FC = () => {
    const query = useCustomQuery(["projects"], ProjectService.findAll);
    const [ projectItems, setProjectItems ] = useState<Project[]>(query.data ?? []);
    useEffect(() => {
        setProjectItems(query.data ?? []);
    }, [query.data]);

    const [ projectForm, setProjectForm ] = useState<ProjectForm>({ show: false });

    const handleClose = (madeChanges: boolean, deleted: boolean) => {
        madeChanges && toast.success(`Project ${projectForm.project ? "updated" : "created"} successfully!`);
        deleted && toast.success("Project deleted successfully!");
        setProjectForm({ show: false });
    };

    const [ dndState, setDndState ] = useState<DndState>({
        isDndActive: false,
        madeDndChanges: false,
        isDndSubmitting: false
    });
    const queryClient = useQueryClient();

    const handleToggleDnd = async () => {
        if (dndState.isDndSubmitting) return;
        setDndState(prevDndState => ({ ...prevDndState, isDndSubmitting: true }));

        if (dndState.isDndActive && dndState.madeDndChanges) {
            try {
                await ProjectService.saveAll(projectItems);
                await queryClient.invalidateQueries(["projects"]);
                toast.success("Projects order saved successfully!");
            } catch (e) {
                toast.error(getTitleAndMessage(e));
            }
        }

        setDndState(prevDndState => ({
            ...prevDndState,
            isDndActive: !prevDndState.isDndActive,
            madeDndChanges: false,
            isDndSubmitting: false
        }));
    };

    const handleOnSetItems = (items: Project[]) => {
        for (const s of query.data ?? []) {
            const newProject = items.find(s => s.id === s.id);
            if (newProject) {
                s.sort = newProject.sort;
            }
        }

        setDndState(prevDndState => ({ ...prevDndState, madeDndChanges: true }));
    };

    return (
        <Page title="Projects">
            { query.isSuccess

                ? <div className={styles.projectsWrapper}>
                    {projectForm.show && <ProjectForm project={projectForm.project} handleClose={handleClose} />}
                    <SortableList
                        items={projectItems.sort((a, b) => a.sort - b.sort)}
                        setItems={setProjectItems}
                        onSetItems={handleOnSetItems}
                        renderItem={project => (
                            <ProjectCard
                                project={project}
                                handleEdit={() => setProjectForm({ project, show: true })}
                                isDndActive={dndState.isDndActive}
                            />
                        )}
                        wrapperProps={{
                            className: styles.cardsWrapper,
                            size: "350px",
                            gap: "2.5em"
                        }}
                    />
                    <Toolbar
                        tools={[
                            {
                                handleClick: handleToggleDnd,
                                loading: dndState.isDndSubmitting,
                                children: dndState.isDndActive ? <BsCheckLg size={25} /> : <RxDragHandleDots2 size={25}/>
                            },
                            {
                                handleClick: () => setProjectForm({ show: true }),
                                children: <FaPlus size={22} />
                            }
                        ]}
                    />
                </div>

                : <Loader />
            }
        </Page>
    );
};
