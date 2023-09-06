import { ImageService } from "api/services";
import { SortableDragHandle, SortableItem } from "components/common";
import { SKILL_PLACEHOLDER } from "libs/constants";
import type { FC } from "react";
import type { Skill } from "types/entities";

import styles from "./skill-card.module.scss";

type Props = {
    skill: Skill;
    handleAction: () => void;
    isDndActive: boolean;
    isOverlay?: boolean;
};

export const SkillCard: FC<Props> = ({ skill, handleAction, isDndActive, isOverlay }) => {
    return (
        <SortableItem
            id={skill.id}
            itemProps={{
                className: styles.card,
                onClick: handleAction
            }}
        >
            {isDndActive && <SortableDragHandle className={styles.dragHandle} isDragging={isOverlay} />}
            <div className={styles.cardImage}>
                <img
                    src={ImageService.getImageUrl(skill.image) ?? SKILL_PLACEHOLDER}
                    alt={skill.image.altEn}
                    title={skill.name}
                    onError={e => e.currentTarget.src = SKILL_PLACEHOLDER}
                    loading="lazy"
                />
            </div>
            <div className={styles.cardContent}>
                {skill.name}
            </div>
        </SortableItem>
    );
};
