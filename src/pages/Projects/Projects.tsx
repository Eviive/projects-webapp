import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "api/services";
import { Loader, Page, SearchBar, SortableList, Toolbar } from "components/common";
import { ProjectCard, ProjectForm } from "components/projects";
import { useDragAndDrop } from "hooks/useDragAndDrop";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCheckLg } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { RxDragHandleDots2 } from "react-icons/rx";
import type { Project } from "types/entities";

import styles from "./projects.module.scss";

type ProjectForm = {
    project?: Project;
    show: boolean;
};

export const Projects: FC = () => {
    const query = useQuery([ "projects" ], ProjectService.findAll);

    const queryClient = useQueryClient();

    const handleSaveProjectsOrder = async (projects: Project[]) => {
        try {
            await ProjectService.sort(projects.map(project => project.id));
            await queryClient.invalidateQueries([ "projects" ]);
            toast.success("Projects order saved successfully!");
        } catch (e) {
            console.error("Error while saving projects order", e);
        }
    };

    const {
        items: [ projectItems, setProjectItems ],
        dndState,
        handleToggleDnd,
        handleOnSetItems
    } = useDragAndDrop(query, handleSaveProjectsOrder);

    const [ searchQuery, setSearchQuery ] = useState("");

    const filteredProjectItems = projectItems.filter(project => project.title.toLowerCase().includes(searchQuery.trim().toLowerCase()));

    const [ projectForm, setProjectForm ] = useState<ProjectForm>({ show: false });

    const handleClose = (isTouched: boolean, isDeleted: boolean) => {
        isTouched && toast.success(`Project ${projectForm.project ? "updated" : "created"} successfully!`);
        isDeleted && toast.success("Project deleted successfully!");
        setProjectForm({ show: false });
    };

    return (
        <Page title="Projects">
            { query.isSuccess

                ? <div className={styles.projectsWrapper}>
                    {projectForm.show &&
                        <ProjectForm
                            project={projectForm.project}
                            numberOfProjects={projectItems.length}
                            handleClose={handleClose}
                        />
                    }
                    <SearchBar handleChange={setSearchQuery} />
                    <SortableList
                        items={filteredProjectItems}
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
                                name: "Toggle drag and drop",
                                handleClick: handleToggleDnd,
                                loading: dndState.isDndSubmitting,
                                disabled: projectItems.length !== filteredProjectItems.length,
                                children: dndState.isDndActive ? <BsCheckLg size={25} /> : <RxDragHandleDots2 size={25}/>
                            },
                            {
                                name: "Add project",
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
