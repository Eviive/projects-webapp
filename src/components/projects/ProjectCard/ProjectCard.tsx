import { ImageService } from "api/services";
import { Anchor, SortableDragHandle, SortableItem } from "components/common";
import type { FC } from "react";
import { FaHeart } from "react-icons/fa";
import { FiEdit, FiExternalLink, FiGithub } from "react-icons/fi";
import type { Project } from "types/entities";
import { PROJECT_PLACEHOLDER, SKILL_PLACEHOLDER } from "utils/entities";

import styles from "./project-card.module.scss";

type Props = {
    project: Project;
    handleEdit: () => void;
    isDndActive: boolean;
};

export const ProjectCard: FC<Props> = ({ project, handleEdit, isDndActive }) => {

    project.skills.sort((a, b) => a.sort - b.sort);

    const skills = project.skills.map(s =>
        <img
            key={s.id}
            src={ImageService.getImageUrl(s.image) ?? SKILL_PLACEHOLDER}
            alt={s.name}
            title={s.name}
            onError={e => e.currentTarget.src = SKILL_PLACEHOLDER}
            loading="lazy"
        />
    );

    return (
        <SortableItem id={project.id} itemProps={{ className: styles.card }}>
            <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                        <div>
                            <h1>{project.title}</h1>
                            {project.featured && <FaHeart size={20} fill="red" />}
                        </div>
                        <span>{Intl.DateTimeFormat("en-GB", { dateStyle: "short" }).format(new Date(project.creationDate))}</span>
                    </div>
                    <div className={styles.cardLinks}>
                        {isDndActive && <SortableDragHandle />}
                        <button onClick={handleEdit}>
                            <FiEdit size={22} />
                        </button>
                        <Anchor href={project.repoUrl}>
                            <FiGithub size={22} />
                        </Anchor>
                        <Anchor href={project.demoUrl}>
                            <FiExternalLink size={22} />
                        </Anchor>
                    </div>
                </div>
                <div className={styles.cardDescription}>
                    <p>{project.description}</p>
                    <div className={styles.cardSkills}>
                        {skills}
                    </div>
                </div>
            </div>
            <div className={styles.cardImage}>
                <img
                    src={ImageService.getImageUrl(project.image) ?? PROJECT_PLACEHOLDER}
                    alt={project.image.alt}
                    title={project.title}
                    onError={e => e.currentTarget.src = PROJECT_PLACEHOLDER}
                    loading="lazy"
                />
            </div>
        </SortableItem>
    );
};
