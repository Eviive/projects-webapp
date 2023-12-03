import type { useDisclosure } from "@nextui-org/react";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { ProjectForm } from "components/projects";
import type { FC } from "react";
import type { Project } from "types/entities";

type Props = Pick<ReturnType<typeof useDisclosure>, "isOpen" | "onOpenChange"> & {
    project: Project | null;
    numberOfProjects: number;
    handleClose: (isTouched: boolean, isDeleted: boolean) => void;
};

export const ProjectFormModal: FC<Props> = props => {
    return (
        <Modal
            isOpen={props.isOpen}
            onOpenChange={props.onOpenChange}
            onClose={() => props.handleClose(false, false)}
            scrollBehavior="inside"
            isDismissable={false}
        >
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader>{props.project ? `Editing ${props.project.title}` : "Creating project"}</ModalHeader>
                        <ModalBody>
                            {props.isOpen && (
                                <ProjectForm
                                    project={props.project}
                                    numberOfProjects={props.numberOfProjects}
                                    handleClose={(isTouched, isDeleted) => {
                                        props.handleClose(isTouched, isDeleted);
                                        onClose();
                                    }}
                                />
                            )}
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
