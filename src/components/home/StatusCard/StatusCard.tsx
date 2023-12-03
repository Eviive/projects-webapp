import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import type { FC, ReactNode } from "react";
import type { Status } from "types/health";

type Props = {
    title: string;
    icon: ReactNode;
    status: Status;
};

const STATUS_COLORS: Record<Status, string> = {
    UP: "hsl(121deg 34% 51%)",
    DOWN: "hsl(355deg, 60%, 52%)",
    OUT_OF_SERVICE: "hsl(21deg, 100%, 50%)",
    UNKNOWN: "hsl(0deg, 0%, 50%)"
};

export const StatusCard: FC<Props> = props => {
    return (
        <Card
            classNames={{
                base: "basis-64 grow shrink flex flex-col gap-1 font-bold rounded-lg",
                header: "text-lg",
                body: "flex flex-row justify-between items-center text-3xl"
            }}
        >
            <CardHeader>
                <span
                    className="w-2.5 h-2.5 rounded-full inline-block mr-2"
                    style={{ backgroundColor: STATUS_COLORS[props.status] }}
                />
                <h3>{props.title}</h3>
            </CardHeader>
            <Divider />
            <CardBody>
                {props.icon}
                <p>{props.status}</p>
            </CardBody>
        </Card>
    );
};
