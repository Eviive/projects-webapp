import { Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
import { ImageService } from "api/services";
import { SortableDragHandle, SortableItem } from "components/common";
import { useContextMenu } from "hooks/useContextMenu";
import { SKILL_PLACEHOLDER } from "libs/constants";
import type { FC } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import type { Skill } from "types/entities";

type Props = {
    skill: Skill;
    handleAction: () => void;
    isDndActive: boolean;
    isOverlay?: boolean;
};

export const SkillCard: FC<Props> = ({ skill, ...props }) => {

    const { addSection } = useContextMenu();

    return (
        <SortableItem id={skill.id} className="flex justify-self-stretch">
            <Card
                classNames={{
                    base: "grow",
                    header: "px-4 justify-between text-left",
                    body: "p-4 justify-end items-center"
                }}
                onContextMenu={!props.isOverlay
                    ? e => addSection(e, {
                        title: skill.name,
                        items: [
                            {
                                title: "Edit",
                                icon: <MdEdit size={25} />,
                                handleAction: props.handleAction
                            },
                            {
                                title: "Delete",
                                icon: <MdDelete size={25} />,
                                handleAction: () => console.log("Delete"),
                                danger: true
                            }
                        ]
                    })
                    : undefined
                }
            >
                <CardHeader>
                    <b className="truncate text-sm">
                        {skill.name}
                    </b>
                    {props.isDndActive && <SortableDragHandle className="ml-1" isDragging={props.isOverlay} />}
                </CardHeader>
                <Divider />
                <CardBody>
                    <Image
                        className="object-cover aspect-square drop-shadow-[0_1px_1px_hsl(0deg,0%,0%,0.5)]"
                        src={ImageService.getImageUrl(skill.image) ?? SKILL_PLACEHOLDER}
                        alt={skill.image.altEn}
                        width={100}
                        radius="sm"
                        disableSkeleton={props.isOverlay}
                        loading="lazy"
                    />
                </CardBody>
            </Card>
        </SortableItem>
    );
};
