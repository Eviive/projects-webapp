import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { ImageService } from "api/services";
import { SortableDragHandle, SortableItem } from "components/common";
import { SKILL_PLACEHOLDER } from "libs/constants";
import type { FC } from "react";
import type { Skill } from "types/entities";

type Props = {
    skill: Skill;
    handleAction: () => void;
    isDndActive: boolean;
    isOverlay?: boolean;
};

export const SkillCard: FC<Props> = ({ skill, ...props }) => {
    return (
        <SortableItem id={skill.id} className="flex justify-self-stretch">
            <Card
                as="div"
                classNames={{
                    base: "grow",
                    header: "pb-0 pt-2 px-4 justify-between text-left",
                    body: "p-4 justify-end items-center"
                }}
                isPressable={!props.isDndActive}
                onPress={props.handleAction}
            >
                <CardHeader>
                    <b className="truncate text-sm">
                        {skill.name}
                    </b>
                    {props.isDndActive && <SortableDragHandle className="ml-1" isDragging={props.isOverlay} />}
                </CardHeader>
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
