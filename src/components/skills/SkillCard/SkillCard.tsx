import { ImageService } from "api/services";
import { FC } from "react";
import { FaPlus } from "react-icons/all";
import { Skill } from "types/entities";

import styles from "./skill-card.module.scss";

type Props = {
    skill?: Skill;
    handleAction: () => void;
};

const PLACEHOLDER = "https://via.placeholder.com/1920x1080/E6E6E6/000000?text=No+image+available+for+this+skill";

export const SkillCard: FC<Props> = ({ skill, handleAction }) => {

    return (
        <div className={skill ? styles.card : `${styles.card} ${styles.addCard}`} onClick={handleAction}>
            <div className={styles.cardImage}>
                {skill

                    ? <img
                        src={ImageService.getImageUrl(skill.image) ?? PLACEHOLDER}
                        alt={skill.image.alt}
                        title={skill.name}
                        onError={e => e.currentTarget.src = PLACEHOLDER}
                    />

                    : <FaPlus />
                }
            </div>
            <div className={styles.cardContent}>
                {skill ? skill.name : "Add skill"}
            </div>
        </div>
    );
};
