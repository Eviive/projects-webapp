import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { SkillService } from "api/services";
import { Loader, Page } from "components/common";
import { SkillCard, SkillForm } from "components/skills";
import { useCustomQuery } from "hooks/useCustomQuery";
import { GridLayout } from "layouts";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Skill } from "types/entities";

import styles from "./skills.module.scss";

type SkillForm = {
    skill?: Skill;
    show: boolean;
};

export const Skills: FC = () => {
    const sensors =useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

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

    const [ isDndActive, setIsDndActive ] = useState(false);
    const [ madeDndChanges, setMadeDndChanges ] = useState(false);
    const queryClient = useQueryClient();

    const handleToggleDnd = () => {
        setIsDndActive(prevState => {
            if (prevState && madeDndChanges) {
                (async () => {
                    await SkillService.saveAll(skillItems);
                    await queryClient.invalidateQueries([ "skills", "projects" ]);
                    toast.success("Skills order saved successfully!");
                })();
            }

            return !prevState;
        });
    };

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;

        if (over?.id && active.id !== over.id) {
            setSkillItems(prevItems => {
                const oldIndex = prevItems.findIndex(s => s.id === active.id);
                const newIndex = prevItems.findIndex(s => s.id === over.id);

                const newItems = arrayMove(prevItems, oldIndex, newIndex)
                    .map((s, i) => ({ ...s, sort: i + 1 }));

                for (const s of query.data ?? []) {
                    const newSkill = newItems.find(ns => ns.id === s.id);
                    if (newSkill) {
                        s.sort = newSkill.sort;
                    }
                }

                setMadeDndChanges(true);

                return newItems;
            });
        }
    };

    return (
        <Page title="Skills - Dashboard">
            { query.isSuccess

                ? <div className={styles.skillsWrapper}>
                    {skillForm.show && <SkillForm skill={skillForm.skill} numberOfSkills={skillItems.length} handleClose={handleClose} />}
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                        <SortableContext items={skillItems}>
                            <GridLayout className={styles.cardsWrapper} size="125px" gap="2em">
                                {skillItems
                                    .sort((a, b) => a.sort - b.sort)
                                    .map(skill =>
                                        <SkillCard key={skill.id} skill={skill} handleAction={() => setSkillForm({ skill, show: true })} isDndActive={isDndActive} />
                                    )
                                }
                                <SkillCard handleAction={() => setSkillForm({ show: true })} isDndActive={isDndActive} toggleDnd={handleToggleDnd} />
                            </GridLayout>
                        </SortableContext>
                    </DndContext>
                </div>

                : <Loader />
            }
        </Page>
    );
};
