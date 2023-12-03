import { Card, CardBody, CardHeader, Chip, Divider, Image } from "@nextui-org/react";
import { ImageService } from "api/services";
import { SortableDragHandle, SortableItem } from "components/common";
import { PROJECT_PLACEHOLDER, SKILL_PLACEHOLDER } from "libs/constants";
import type { FC } from "react";
import { useMemo } from "react";
import { FaHeart } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";
import type { Project } from "types/entities";
import { useContextMenu } from "../../../hooks/useContextMenu";

const dateFormatter = Intl.DateTimeFormat("en-GB", { dateStyle: "short" });

type Props = {
    project: Project;
    handleAction: () => void;
    isDndActive: boolean;
    isOverlay?: boolean;
};

export const ProjectCard: FC<Props> = ({ project, ...props }) => {

    const { addSection } = useContextMenu();

    const skills = useMemo(() => {
        project.skills.sort((a, b) => a.sort - b.sort);

        return project.skills.map(s =>
            <Image
                key={s.id}
                className="object-cover aspect-square drop-shadow-[0_1px_1px_hsl(0deg,0%,0%,0.5)]"
                src={ImageService.getImageUrl(s.image) ?? SKILL_PLACEHOLDER}
                alt={s.image.altEn}
                width={35}
                radius="none"
                disableSkeleton={props.isOverlay}
                loading="lazy"
            />
        );
    }, [ project.skills, props.isOverlay ]);

    return (
        <SortableItem id={project.id} className="flex justify-self-stretch">
            <Card
                classNames={{
                    base: "grow",
                    header: "px-4 justify-between text-left",
                    body: "p-4 justify-between gap-3"
                }}
                onContextMenu={!props.isOverlay
                    ? e => addSection(e, {
                        title: project.title,
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
                    <div>
                        <b className="flex items-center gap-1.5 truncate">
                            {project.title}
                            {project.featured && (
                                <Chip
                                    classNames={{
                                        base: "text-danger bg-danger bg-opacity-25",
                                        content: "p-0"
                                    }}
                                    variant="flat"
                                    size="sm"
                                >
                                    <FaHeart className="p-0.5" size={16} />
                                </Chip>
                            )}
                        </b>
                        <small className="text-default-500">{dateFormatter.format(new Date(project.creationDate))}</small>
                    </div>
                    {props.isDndActive && <SortableDragHandle className="ml-1" isDragging={props.isOverlay} />}
                </CardHeader>
                <Divider />
                <CardBody>
                    <p>{project.descriptionEn}</p>

                    <div>
                        <Image
                            classNames={{
                                wrapper: "mx-auto",
                                img: "object-cover aspect-[16/10] drop-shadow-lg"
                            }}
                            src={ImageService.getImageUrl(project.image) ?? PROJECT_PLACEHOLDER}
                            alt={project.image.altEn}
                            width={512}
                            radius="sm"
                            disableSkeleton={props.isOverlay}
                            loading="lazy"
                        />

                        <div className="flex justify-center gap-3 mt-5 mb-1">
                            {skills}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </SortableItem>
    );
};
