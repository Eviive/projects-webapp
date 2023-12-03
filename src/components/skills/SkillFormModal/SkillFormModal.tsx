import type { useDisclosure } from "@nextui-org/react";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import type { FC } from "react";
import type { Skill } from "types/entities";
import { SkillForm } from "../SkillForm/SkillForm";

type Props = Pick<ReturnType<typeof useDisclosure>, "isOpen" | "onOpenChange"> & {
    skill: Skill | null;
    numberOfSkills: number;
    handleClose: (isTouched: boolean, isDeleted: boolean) => void;
};

export const SkillFormModal: FC<Props> = props => {
    return (
        <Modal
            isOpen={props.isOpen}
            onOpenChange={props.onOpenChange}
            onClose={() => props.handleClose(false, false)}
            classNames={{
                wrapper: "items-center"
            }}
            scrollBehavior="inside"
            isDismissable={false}
        >
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader>{props.skill ? `Editing ${props.skill.name}` : "Creating skill"}</ModalHeader>
                        <ModalBody>
                            {props.isOpen && (
                                <SkillForm
                                    skill={props.skill}
                                    numberOfSkills={props.numberOfSkills}
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
