import { ProjectService } from "api/services";
import { Loader } from "components/common";
import { ProjectCard, ProjectForm } from "components/projects";
import { useCustomQuery } from "hooks/useCustomQuery";
import { GridLayout } from "layouts";
import { FC, useState } from "react";
import { Project } from "types/entities";

import styles from "./projects.module.scss";

export const Projects: FC = () => {

    const query = useCustomQuery([ "projects" ], ProjectService.findAll);

    const [ editProject, setEditProject ] = useState<Project | null>(null);

    return (
        <>
            { query.isSuccess

                ? <div className={styles.projectsWrapper}>
                    <div className={styles.projectsContent}>
                        {editProject && <ProjectForm project={editProject} handleClose={() => setEditProject(null)} />}
                        <GridLayout className={styles.wrapper} size="350px" gap="1.5em">
                            {[ ...query.data, ...query.data, ...query.data ].map((project, index) => <ProjectCard key={index} project={project} handleEdit={() => setEditProject(project)} />)}
                        </GridLayout>
                    </div>
                </div>

                : <Loader />
            }
        </>
    );
};
