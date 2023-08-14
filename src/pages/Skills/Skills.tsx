import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SkillService } from "api/services";
import { Loader, Page, SearchBar, SortableList, Toolbar } from "components/common";
import { SkillCard, SkillForm } from "components/skills";
import { useDragAndDrop } from "hooks/useDragAndDrop";
import { getTitleAndMessage } from "libs/utils";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCheckLg } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { RxDragHandleDots2 } from "react-icons/rx";
import type { Skill } from "types/entities";

import styles from "./skills.module.scss";

type SkillForm = {
    skill?: Skill;
    show: boolean;
};

export const Skills: FC = () => {
    const query = useQuery([ "skills" ], SkillService.findAll);

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

    const [ searchQuery, setSearchQuery ] = useState("");

    const filteredSkillItems = skillItems.filter(skill => skill.name.toLowerCase().includes(searchQuery.trim().toLowerCase()));

    const [ skillForm, setSkillForm ] = useState<SkillForm>({ show: false });

    const handleClose = (isTouched: boolean, isDeleted: boolean) => {
        isTouched && toast.success(`Skill ${skillForm.skill ? "updated" : "created"} successfully!`);
        isDeleted && toast.success("Skill deleted successfully!");
        setSkillForm({ show: false });
    };

    return (
        <Page title="Skills">
            { query.isSuccess

                ? <div className={styles.skillsWrapper}>
                    {skillForm.show &&
                        <SkillForm
                            skill={skillForm.skill}
                            numberOfSkills={skillItems.length}
                            handleClose={handleClose}
                        />
                    }
                    <SearchBar handleChange={setSearchQuery} />
                    <SortableList
                        items={filteredSkillItems}
                        setItems={setSkillItems}
                        onSetItems={handleOnSetItems}
                        renderItem={skill => (
                            <SkillCard
                                skill={skill}
                                handleAction={() => setSkillForm({ skill, show: true })}
                                isDndActive={dndState.isDndActive}
                            />
                        )}
                        wrapperProps={{
                            className: styles.cardsWrapper,
                            size: "125px",
                            gap: "2em"
                        }}
                    />
                    <Toolbar
                        tools={[
                            {
                                name: "Toggle drag and drop",
                                handleClick: handleToggleDnd,
                                loading: dndState.isDndSubmitting,
                                disabled: skillItems.length !== filteredSkillItems.length,
                                children: dndState.isDndActive ? <BsCheckLg size={25} /> : <RxDragHandleDots2 size={25}/>
                            },
                            {
                                name: "Add skill",
                                handleClick: () => setSkillForm({ show: true }),
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
