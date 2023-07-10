import { ImageService } from "api/services";
import { Anchor } from "components/common";
import { FC } from "react";
import { FaHeart } from "react-icons/fa";
import { FiEdit, FiExternalLink, FiGithub } from "react-icons/fi";
import { Project } from "types/entities";

import styles from "./project-card.module.scss";

type Props = {
    project: Project;
    handleEdit: () => void;
};

const PLACEHOLDER = "https://placehold.co/1920x1080/E6E6E6/000000?font=source-sans-pro&text=No+image+available+for+this+project";

export const ProjectCard: FC<Props> = ({ project, handleEdit }) => {

    const skills = project.skills
        .sort((a, b) => a.sort - b.sort)
        .map((s, i) => {
            return <img key={i} src={ImageService.getImageUrl(s.image)} alt={s.name} title={s.name} />;
        });

    return (
        <li className={styles.card}>
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
                        <button onClick={handleEdit}>
                            <FiEdit size={25} />
                        </button>
                        <Anchor href={project.repoUrl}>
                            <FiGithub size={25} />
                        </Anchor>
                        <Anchor href={project.demoUrl}>
                            <FiExternalLink size={25} />
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
                    src={ImageService.getImageUrl(project.image) ?? PLACEHOLDER}
                    alt={project.image.alt}
                    title={project.title}
                    onError={e => e.currentTarget.src = PLACEHOLDER}
                />
            </div>
        </li>
    );
};
