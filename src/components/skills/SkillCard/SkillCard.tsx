import { ImageService } from "api/services";
import { SortableDragHandle, SortableItem } from "components/common";
import { ComponentProps, FC } from "react";
import { Skill } from "types/entities";

import styles from "./skill-card.module.scss";

type Props = {
    skill: Skill;
    handleAction: () => void;
    isDndActive: boolean;
};

const PLACEHOLDER = "https://placehold.co/68/E6E6E6/000000?font=source-sans-pro&text=No+image";

export const SkillCard: FC<Props> = props => {

    const itemProps: ComponentProps<typeof SortableItem>["itemProps"] = {
        className: styles.card,
        onClick: props.handleAction
    };

    return (
        <SortableItem id={props.skill.id} itemProps={itemProps}>
            {props.isDndActive && <SortableDragHandle className={styles.dragHandle} />}
            <div className={styles.cardImage}>
                <img
                    src={ImageService.getImageUrl(props.skill.image) ?? PLACEHOLDER}
                    alt={props.skill.image.alt}
                    title={props.skill.name}
                    onError={e => e.currentTarget.src = PLACEHOLDER}
                    loading="lazy"
                />
            </div>
            <div className={styles.cardContent}>
                {props.skill.name}
            </div>
        </SortableItem>
    );
};
