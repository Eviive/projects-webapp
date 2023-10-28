import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import type { FC, ReactNode } from "react";
import { HttpStatusChip } from "../HttpStatusChip/HttpStatusChip";

type Props = {
    name: string;
    code: number;
    icon: ReactNode;
    value: number;
};

export const HttpStatusCard: FC<Props> = props => {
    return (
        <Card
            as="li"
            classNames={{
                base: "basis-64 grow shrink flex flex-col gap-1 font-bold rounded-lg",
                header: "flex gap-2 text-lg",
                body: "flex flex-row justify-between items-center text-3xl"
            }}
        >
            <CardHeader>
                {props.name}
                <HttpStatusChip code={props.code} />
            </CardHeader>
            <Divider />
            <CardBody>
                {props.icon}
                {props.value}
            </CardBody>
        </Card>
    );
};
