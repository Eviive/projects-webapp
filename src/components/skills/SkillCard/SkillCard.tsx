import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImageService } from "api/services";
import { FC, MouseEventHandler } from "react";
import { CgClose } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { RxDragHandleDots2 } from "react-icons/rx";
import { Skill } from "types/entities";

import styles from "./skill-card.module.scss";

type Props = {
    skill?: Skill;
    handleAction: () => void;
    isDndActive?: boolean;
    toggleDnd?: () => void;
};

const PLACEHOLDER = "https://via.placeholder.com/1920x1080/E6E6E6/000000?text=No+image+available+for+this+skill";

export const SkillCard: FC<Props> = ({ skill, handleAction, isDndActive, toggleDnd }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: skill?.id ?? 0, disabled: !skill });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    const handleClick: MouseEventHandler<HTMLButtonElement> = e => {
        e.stopPropagation();
        toggleDnd?.();
    };

    return (
        <div ref={setNodeRef} style={style} className={skill ? styles.card : `${styles.card} ${styles.addCard}`} onClick={handleAction}>
            {skill

                ? (isDndActive &&
                    <span className={styles.dragHandle} {...attributes} {...listeners}>
                        <RxDragHandleDots2 size={22}/>
                    </span>
                )

                : <button className={`${styles.dragHandle} ${styles.toggleDnd}`} onClick={handleClick}>
                    {isDndActive ? <CgClose size={18} /> : <FiEdit size={18}/>}
                </button>
            }
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
