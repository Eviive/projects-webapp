import { ProjectService } from "api/services";
import { Button, Loader } from "components/common";
import { ProjectCard, ProjectForm } from "components/projects";
import { useCustomQuery } from "hooks/useCustomQuery";
import { GridLayout } from "layouts";
import { FC, useState } from "react";
import { FaPlus } from "react-icons/all";
import { Project } from "types/entities";

import styles from "./projects.module.scss";

type ProjectForm = {
    project?: Project;
    show: boolean;
}

export const Projects: FC = () => {

    const query = useCustomQuery(["projects"], ProjectService.findAll);

    const [ projectForm, setProjectForm ] = useState<ProjectForm>({ show: false });

    return (
        <>
            { query.isSuccess

                ? <div className={styles.projectsWrapper}>
                    {projectForm.show && <ProjectForm project={projectForm.project} handleClose={() => setProjectForm({ show: false })} />}
                    <GridLayout className={styles.cardsWrapper} size="350px" gap="2.5em">
                        {[ ...query.data, ...query.data, ...query.data ].map((project, index) => <ProjectCard key={index} project={project} handleEdit={() => setProjectForm({ project, show: true })} />)}
                    </GridLayout>
                    <Button className={styles.addButton} handleClick={() => setProjectForm({ show: true })}>
                        <FaPlus size={22} />
                    </Button>
                </div>

                : <Loader />
            }
        </>
    );
};
