import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
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
        <Card className="basis-64 grow shrink flex flex-col gap-1 font-bold rounded-lg">
            <CardHeader className="space-y-0 p-3 flex-row items-center text-lg">
                <span
                    className="w-2.5 h-2.5 rounded-full inline-block mr-2"
                    style={{ backgroundColor: STATUS_COLORS[props.status] }}
                />
                <h3>{props.title}</h3>
            </CardHeader>
            <Separator />
            <CardContent className="p-3 flex flex-row justify-between items-center text-3xl">
                {props.icon}
                <p>{props.status}</p>
            </CardContent>
        </Card>
    );
};
