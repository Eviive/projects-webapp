import { Spinner, useDisclosure } from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SkillService } from "api/services";
import { Loader, Page, SearchBar, SortableList } from "components/common";
import { SkillCard, SkillFormModal } from "components/skills";
import { useContextMenu } from "hooks/useContextMenu";
import { useDragAndDrop } from "hooks/useDragAndDrop";
import { getTitleAndMessage } from "libs/utils";
import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MdAdd, MdCheck, MdDragIndicator } from "react-icons/md";
import type { Skill } from "types/entities";

export const Skills: FC = () => {

    const query = useQuery([ "skills" ], SkillService.findAll);

    const { addSection } = useContextMenu();

    const queryClient = useQueryClient();

    const handleSaveSkillsOrder = async (skills: Skill[]) => {
        try {
            await SkillService.sort(skills.map(skill => skill.id));
            await queryClient.invalidateQueries([ "skills", "projects" ]);
            toast.success("Skills order saved successfully!");
        } catch (e) {
            console.error("Error while saving skills order", getTitleAndMessage(e));
        }
    };

    const {
        items: [ skillItems, setSkillItems ],
        dndState,
        handleToggleDnd,
        handleOnSetItems
    } = useDragAndDrop(query, handleSaveSkillsOrder);

    const getDndContextMenuIcon = (): ReactNode => {
        if (!dndState.isDndActive) {
            return <MdDragIndicator size={25} />;
        }

        return dndState.isDndSubmitting
            ? <Spinner className="m-0.5" color="danger" size="sm" />
            : <MdCheck size={25}/>;
    };

    const [ searchQuery, setSearchQuery ] = useState("");

    const filteredSkillItems = useMemo(() => (
        skillItems.filter(skill => skill.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    ), [ skillItems, searchQuery ]);

    const [ skillForm, setSkillForm ] = useState<Skill | null>(null);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleClose = (isTouched: boolean, isDeleted: boolean) => {
        isTouched && toast.success(`Skill ${skillForm ? "updated" : "created"} successfully!`);
        isDeleted && toast.success("Skill deleted successfully!");
        setSkillForm(null);
    };

    return (
        <Page title="Skills">
            {query.isSuccess

                ? <div
                    className="w-full h-full px-[5%] py-12 flex flex-col gap-12"
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
                                disabled: skillItems.length !== filteredSkillItems.length || dndState.isDndSubmitting
                            }
                        ]
                    })}
                >
                    <SkillFormModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        skill={skillForm}
                        numberOfSkills={skillItems.length}
                        handleClose={handleClose}
                    />
                    <SearchBar
                        value={searchQuery}
                        handleChange={setSearchQuery}
                    />
                    <SortableList
                        items={filteredSkillItems}
                        setItems={setSkillItems}
                        onSetItems={handleOnSetItems}
                        renderItem={(skill, isOverlay) => (
                            <SkillCard
                                skill={skill}
                                handleAction={() => {
                                    setSkillForm(skill);
                                    onOpen();
                                }}
                                isDndActive={dndState.isDndActive && !dndState.isDndSubmitting}
                                isOverlay={isOverlay}
                            />
                        )}
                        wrapperProps={{
                            minWidth: "125px",
                            gap: "2em",
                            columnCount: "infinity",
                            centerHorizontally: true
                        }}
                    />
                </div>

                : <Loader />
            }
        </Page>
    );
};
