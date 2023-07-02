import { SkillService } from "api/services";
import { Loader, Page } from "components/common";
import { SkillCard, SkillForm } from "components/skills";
import { useCustomQuery } from "hooks/useCustomQuery";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { Skill } from "types/entities";

import styles from "./skills.module.scss";

type SkillForm = {
    skill?: Skill;
    show: boolean;
};

export const Skills: FC = () => {

    const query = useCustomQuery(["skills"], SkillService.findAll);

    const [ skillForm, setSkillForm ] = useState<SkillForm>({ show: false });

    const handleClose = (madeChanges: boolean, deleted: boolean) => {
        madeChanges && toast.success(`Skill ${skillForm.skill ? "updated" : "created"} successfully!`);
        deleted && toast.success("Skill deleted successfully!");
        setSkillForm({ show: false });
    };

    return (
        <Page title="Skills - Dashboard">
            { query.isSuccess

                ? <div className={styles.skillsWrapper}>
                    {skillForm.show && <SkillForm skill={skillForm.skill} handleClose={handleClose} />}
                    <div className={styles.cardsWrapper}>
                        {query.data.map((skill, index) => <SkillCard key={index} skill={skill} handleAction={() => setSkillForm({ skill, show: true })} />)}
                        <SkillCard handleAction={() => setSkillForm({ show: true })} />
                    </div>
                </div>

                : <Loader />
            }
        </Page>
    );
};
