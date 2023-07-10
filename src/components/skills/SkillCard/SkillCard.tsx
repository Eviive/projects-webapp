import { ImageService } from "api/services";
import { SortableDragHandle, SortableItem } from "components/common";
import { ComponentProps, FC, MouseEventHandler } from "react";
import { BsCheckLg } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Skill } from "types/entities";
import { formatClassNames } from "utils/components";

import styles from "./skill-card.module.scss";

type Props = {
    handleAction: () => void;
    isDndActive: boolean;
} & (SkillCardProps | AddCardProps);

type SkillCardProps = {
    skill: Skill;
};

type AddCardProps = {
    skill?: never;
    toggleDnd: () => void;
};

const PLACEHOLDER = "https://placehold.co/68/E6E6E6/000000?font=source-sans-pro&text=No+image";

export const SkillCard: FC<Props> = props => {
    const handleClick: MouseEventHandler<HTMLButtonElement> = e => {
        e.stopPropagation();
        !props.skill && props.toggleDnd();
    };

    const itemProps: ComponentProps<typeof SortableItem>["itemProps"] = {
        className: formatClassNames(
            styles.card,
            !props.skill && styles.addCard
        ),
        onClick: props.handleAction
    };

    return (
        <SortableItem id={props.skill?.id} itemProps={itemProps}>
            {props.skill

                ? (props.isDndActive && <SortableDragHandle className={styles.dragHandle} />)

                : <button className={`${styles.dragHandle} ${styles.toggleDnd}`} onClick={handleClick}>
                    {props.isDndActive ? <BsCheckLg size={18} /> : <MdEdit size={18}/>}
                </button>
            }
            <div className={styles.cardImage}>
                {props.skill

                    ? <img
                        src={ImageService.getImageUrl(props.skill.image) ?? PLACEHOLDER}
                        alt={props.skill.image.alt}
                        title={props.skill.name}
                        onError={e => e.currentTarget.src = PLACEHOLDER}
                    />

                    : <FaPlus />
                }
            </div>
            <div className={styles.cardContent}>
                {props.skill ? props.skill.name : "Add skill"}
            </div>
        </SortableItem>
    );
};
