import { Spinner, useDisclosure } from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "api/services";
import { Loader, Page, SearchBar, SortableList, Toolbar } from "components/common";
import { ProjectCard, ProjectFormModal } from "components/projects";
import { useDragAndDrop } from "hooks/useDragAndDrop";
import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BsCheckLg } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { MdAdd, MdCheck, MdDragIndicator } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import type { Project } from "types/entities";
import { useContextMenu } from "../../hooks/useContextMenu";

export const Projects: FC = () => {

    const query = useQuery([ "projects" ], ProjectService.findAll);

    const { addSection } = useContextMenu();

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

    const getDndContextMenuIcon = (): ReactNode => {
        if (!dndState.isDndActive) {
            return <MdDragIndicator size={25} />;
        }

        return dndState.isDndSubmitting
            ? <Spinner className="m-0.5" color="danger" size="sm" />
            : <MdCheck size={25} />;
    };

    const [ searchQuery, setSearchQuery ] = useState("");

    const filteredProjectItems = useMemo(() => (
        projectItems.filter(project => project.title.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    ), [ projectItems, searchQuery ]);

    const [ projectForm, setProjectForm ] = useState<Project | null>(null);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleClose = (isTouched: boolean, isDeleted: boolean) => {
        isTouched && toast.success(`Project ${projectForm ? "updated" : "created"} successfully!`);
        isDeleted && toast.success("Project deleted successfully!");
        setProjectForm(null);
    };

    return (
        <Page title="Projects">
            {query.isSuccess

                ? <div
                    className="w-full h-full px-[5%] py-12 flex flex-col justify-center items-center gap-12"
                    onContextMenu={e => addSection(e, {
                        title: "Skills",
                        items: [
                            {
                                title: "Add",
                                icon: <MdAdd size={25} />,
                                handleAction: onOpen
                            },
                            {
                                title: "Sort",
                                icon: getDndContextMenuIcon(),
                                handleAction: handleToggleDnd,
                                disabled: projectItems.length !== filteredProjectItems.length || dndState.isDndSubmitting
                            }
                        ]
                    })}
                >
                    <ProjectFormModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        project={projectForm}
                        numberOfProjects={projectItems.length}
                        handleClose={handleClose}
                    />
                    <SearchBar value={searchQuery} handleChange={setSearchQuery} />
                    <SortableList
                        items={filteredProjectItems}
                        setItems={setProjectItems}
                        onSetItems={handleOnSetItems}
                        renderItem={(project, isOverlay) => (
                            <ProjectCard
                                project={project}
                                handleAction={() => {
                                    setProjectForm(project);
                                    onOpen();
                                }}
                                isDndActive={dndState.isDndActive}
                                isOverlay={isOverlay}
                            />
                        )}
                        wrapperProps={{
                            minWidth: "350px",
                            gap: "2.5em",
                            columnCount: 3,
                            centerHorizontally: true
                        }}
                    />
                    <Toolbar
                        tools={[
                            {
                                name: "Toggle drag and drop",
                                handleClick: handleToggleDnd,
                                loading: dndState.isDndSubmitting,
                                disabled: projectItems.length !== filteredProjectItems.length,
                                children: dndState.isDndActive ? <BsCheckLg size={25} /> : <RxDragHandleDots2 size={25} />
                            },
                            {
                                name: "Add project",
                                handleClick: onOpen,
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
