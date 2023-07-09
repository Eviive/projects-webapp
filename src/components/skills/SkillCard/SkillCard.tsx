import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImageService } from "api/services";
import { FC, MouseEventHandler } from "react";
import { MdEdit } from "react-icons/all";
import { BsCheckLg } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { RxDragHandleDots2 } from "react-icons/rx";
import { Skill } from "types/entities";

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
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.skill?.id ?? 0, disabled: !props.skill });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    const handleClick: MouseEventHandler<HTMLButtonElement> = e => {
        e.stopPropagation();
        !props.skill && props.toggleDnd();
    };

    return (
        <div ref={setNodeRef} style={style} className={props.skill ? styles.card : `${styles.card} ${styles.addCard}`} onClick={props.handleAction}>
            {props.skill

                ? (props.isDndActive &&
                    <span className={styles.dragHandle} {...attributes} {...listeners}>
                        <RxDragHandleDots2 size={22}/>
                    </span>
                )

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
        </div>
    );
};
