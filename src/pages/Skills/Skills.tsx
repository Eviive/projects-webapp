import { useQueryClient } from "@tanstack/react-query";
import { SkillService } from "api/services";
import { Loader, Page, SortableList } from "components/common";
import { SkillCard, SkillForm } from "components/skills";
import { useCustomQuery } from "hooks/useCustomQuery";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Skill } from "types/entities";

import styles from "./skills.module.scss";

type SkillForm = {
    skill?: Skill;
    show: boolean;
};

export type DndState = {
    isDndActive: boolean;
    madeDndChanges: boolean;
};

export const Skills: FC = () => {
    const query = useCustomQuery(["skills"], SkillService.findAll);
    const [ skillItems, setSkillItems ] = useState<Skill[]>(query.data ?? []);
    useEffect(() => {
        setSkillItems(query.data ?? []);
    }, [query.data]);

    const [ skillForm, setSkillForm ] = useState<SkillForm>({ show: false });

    const handleClose = (madeChanges: boolean, deleted: boolean) => {
        madeChanges && toast.success(`Skill ${skillForm.skill ? "updated" : "created"} successfully!`);
        deleted && toast.success("Skill deleted successfully!");
        setSkillForm({ show: false });
    };

    const [ dndState, setDndState ] = useState<DndState>({ isDndActive: true, madeDndChanges: false });
    const queryClient = useQueryClient();

    const handleToggleDnd = () => {
        setDndState(prevDndState => {
            if (prevDndState.isDndActive && prevDndState.madeDndChanges) {
                (async () => {
                    await SkillService.saveAll(skillItems);
                    await queryClient.invalidateQueries([ "skills", "projects" ]);
                    toast.success("Skills order saved successfully!");
                })();
            }

            return { ...prevDndState, isDndActive: !prevDndState.isDndActive };
        });
    };

    const handleOnSetItems = (items: Skill[]) => {
        for (const s of query.data ?? []) {
            const newSkill = items.find(s => s.id === s.id);
            if (newSkill) {
                s.sort = newSkill.sort;
            }
        }

        setDndState(prevDndState => ({ ...prevDndState, madeDndChanges: true }));
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
                    <SortableList
                        items={skillItems.sort((a, b) => a.sort - b.sort)}
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
                </div>

                : <Loader />
            }
        </Page>
    );
};
